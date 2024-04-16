import React, { useCallback, useMemo } from 'react';
import { graphql } from 'react-relay';
import pick from 'lodash/pick';
import { Box } from '@chakra-ui/react';
import { Formik } from 'formik';
import { splitTestNameOrFallback } from 'bento-common/utils/naming';
import useToast from 'hooks/useToast';
import AttributesProvider from 'providers/AttributesProvider';
import TemplateProvider from 'providers/TemplateProvider';
import { EditTemplateFormRanks } from 'helpers/constants';
import { showErrors } from 'utils/helpers';
import TopBreadcrumbs from '../common/Breadcrumbs';
import FormsProvider from 'providers/FormsProvider';
import AllModulesProvider from 'providers/AllModulesProvider';
import AllTemplatesProvider from 'providers/AllTemplatesProvider';
import CustomApiEventsProvider from 'providers/CustomApiEventsProvider';
import { FormEntityType } from 'components/GuideForm/types';
import SplitTestForm from './SplitTestForm';
import { noop } from 'bento-common/utils/functions';
import QueryRenderer from 'components/QueryRenderer';
import { EditSplitTestQuery } from 'relay-types/EditSplitTestQuery.graphql';
import cloneDeep from 'lodash/cloneDeep';
import * as EditSplitTestTemplateMutation from 'mutations/EditSplitTestTemplate';
import useNextFocus from 'hooks/useNextFocus';
import { GuideResetToastProvider } from 'components/GuideResetToast';
import TargetingAudienceProvider from 'components/EditorCommon/Audiences/TargetingAudiencesProvider';

type EditSplitTestQueryResponse = EditSplitTestQuery['response'];
export interface EditSplitTestProps extends EditSplitTestQueryResponse {
  refetch: () => void;
}
export type SplitTestForm = {
  // Replace this with an explicit, writeable type.
  templateData: EditSplitTestQueryResponse['splitTest'];
};

export interface TemplateFormProps {
  query: EditSplitTestQueryResponse;
  lastSavedAt: string;
  refetch: () => void;
}

interface ContainerProps {
  splitTestEntityId: string;
}

function EditSplitTest(props: EditSplitTestProps) {
  useNextFocus();

  const { splitTest, autoLaunchableTemplates, launchedNpsSurveys } = props;
  const toast = useToast();
  const initialValues = useMemo(() => {
    // Cloning to remove readonly keys.
    const _splitTest = cloneDeep(splitTest);
    return {
      // TODO: Merge splitTest with other templates
      // that have data, needed for the TopBar validations.
      templateData: _splitTest,
    };
  }, [splitTest]);

  const handleSave = useCallback(async ({ templateData }) => {
    try {
      const response = await EditSplitTestTemplateMutation.commit({
        templateData: pick(templateData, [
          'entityId',
          'name',
          'privateName',
          'description',
          'enableAutoLaunchAt',
          'disableAutoLaunchAt',
        ]),
      });
      const result = response && response.editSplitTestTemplate;
      if (!result) {
        throw new Error('Something went wrong');
      }
      toast({
        title: 'Saved!',
        isClosable: true,
        status: 'success',
      });
      props.refetch();
      return true;
    } catch (e) {
      showErrors(e, toast);
    }

    return false;
  }, []);

  return (
    <>
      <Box>
        <TopBreadcrumbs
          trail={[
            { label: 'Library', path: '/library' },
            { label: 'Split tests', path: '/library?tab=split%20test' },
            { label: splitTestNameOrFallback(splitTest.name) },
          ]}
        />
      </Box>
      <AttributesProvider>
        <TargetingAudienceProvider>
          <Box>
            <FormsProvider
              // Not sure if change to splitTest specific.
              formRankings={EditTemplateFormRanks}
              refetch={props.refetch}
              rootFormDetails={{
                formEntityType: FormEntityType.template,
                entityId: splitTest.entityId,
              }}
            >
              <Formik
                initialValues={initialValues}
                onSubmit={handleSave as any}
                enableReinitialize
              >
                <AllModulesProvider>
                  <AllTemplatesProvider>
                    <CustomApiEventsProvider>
                      <GuideResetToastProvider>
                        <TemplateProvider
                          template={splitTest as any}
                          autoLaunchableTemplates={autoLaunchableTemplates}
                          launchedNpsSurveys={launchedNpsSurveys}
                          onFormDirty={noop}
                        >
                          <SplitTestForm
                            query={props}
                            refetch={props.refetch}
                          />
                        </TemplateProvider>
                      </GuideResetToastProvider>
                    </CustomApiEventsProvider>
                  </AllTemplatesProvider>
                </AllModulesProvider>
              </Formik>
            </FormsProvider>
            <Box height="40px" />
          </Box>
        </TargetingAudienceProvider>
      </AttributesProvider>
    </>
  );
}

graphql`
  fragment EditSplitTest_splitTarget on Template {
    entityId
    designType
    name
    privateName
    isCyoa
    theme
    formFactor
    description
    stepsCount
  }
`;

graphql`
  fragment EditSplitTest_template on Template {
    entityId
    name
    privateName
    isCyoa
    isTemplate
    state
    splitTestState
    description
    type
    theme
    launchedAt
    propagationQueue
    propagationCount
    formFactor
    isSideQuest
    designType
    editedAt
    targetingSet
    splitTargets {
      ...EditSplitTest_splitTarget @relay(mask: false)
    }
    archivedAt
    pageTargetingType
    pageTargetingUrl
    notificationSettings {
      ...Guide_notificationSettings @relay(mask: false)
    }
    modules {
      name
    }
    isAutoLaunchEnabled
    enableAutoLaunchAt
    disableAutoLaunchAt
    priorityRanking
    ...Template_targets @relay(mask: false)
  }
`;

const EDIT_QUERY = graphql`
  query EditSplitTestQuery($splitTestEntityId: EntityId!) {
    splitTest: findTemplate(entityId: $splitTestEntityId) {
      ...EditSplitTest_template @relay(mask: false)
      ...TemplateOverflowMenuButton_template
    }
    autoLaunchableTemplates: templates(
      autoLaunchableOnly: true
      category: all
    ) {
      ...RankableObjects_templates @relay(mask: false)
    }
    launchedNpsSurveys: npsSurveys(launched: true) {
      ...RankableObjects_surveys @relay(mask: false)
    }
  }
`;

export default function EditSplitTestQueryRenderer(cProps: ContainerProps) {
  const { splitTestEntityId } = cProps;

  return (
    <QueryRenderer<EditSplitTestQuery>
      query={EDIT_QUERY}
      variables={{
        splitTestEntityId,
      }}
      render={({ props, retry }) => {
        if (props) {
          return <EditSplitTest {...props} refetch={retry} />;
        }
      }}
    />
  );
}
