import React, { useCallback, useMemo } from 'react';
import { graphql } from 'react-relay';
import { Box } from '@chakra-ui/react';
import { Formik } from 'formik';
import { useRouter } from 'next/router';

import { npsNameOrFallback } from 'bento-common/utils/naming';
import useToast from 'hooks/useToast';
import { NpsFormValue } from 'types';
import { EditTemplateFormRanks } from 'helpers/constants';
import { showErrors } from 'utils/helpers';
import TopBreadcrumbs from '../common/Breadcrumbs';
import FormsProvider from 'providers/FormsProvider';
import { FormEntityType } from 'components/GuideForm/types';
import useNextFocus from 'hooks/useNextFocus';
import { useFetchQuery } from 'hooks/useFetchQuery';
import { EditNpsQuery } from 'relay-types/EditNpsQuery.graphql';
import { prepareNpsSurveyData } from './helpers';
import NpsForm from './NpsForm';
import NpsProvider from './NpsProvider';
import { surveyNotFound } from 'components/EditorCommon/common';
import { formSubmit } from './actions';
import AttributesProvider, {
  useAttributes,
} from 'providers/AttributesProvider';
import { validateTargeting } from 'components/EditorCommon/targeting.helpers';
import { preparePriorityRankingsForSurvey } from 'components/Templates/Tabs/PriorityRankingForm/helpers';
import { useInternalGuideNames } from 'hooks/useFeatureFlag';

type EditNpsProps = {
  refetch: () => Promise<void>;
} & EditNpsQuery['response'];

interface CProps {
  npsEntityId: string;
}

function EditNps({
  npsSurvey,
  refetch,
  launchedNpsSurveys,
  launchedTemplates,
}: EditNpsProps) {
  useNextFocus();

  const { attributes } = useAttributes();
  const enabledInternalNames = useInternalGuideNames();

  const initialValues = useMemo<NpsFormValue>(() => {
    const npsSurveyData = prepareNpsSurveyData(npsSurvey, attributes);
    return {
      npsSurveyData,
      priorityRankings: preparePriorityRankingsForSurvey({
        survey: npsSurveyData,
        enabledInternalNames,
        surveys: launchedNpsSurveys,
        templates: launchedTemplates,
        editedName: npsSurveyData.name,
      }),
    };
  }, [
    npsSurvey,
    launchedTemplates,
    launchedNpsSurveys,
    enabledInternalNames,
    attributes,
  ]);

  const toast = useToast();

  const handleSave = useCallback(async (values: NpsFormValue) => {
    try {
      await formSubmit(values);

      toast({
        title: 'Saved!',
        isClosable: true,
        status: 'success',
      });

      void refetch();
      return true;
    } catch (e) {
      showErrors(e, toast);
    }

    return false;
  }, []);

  const validate = useCallback((values: NpsFormValue) => {
    const errors: Record<string, string> = {};

    if (!validateTargeting(values.npsSurveyData.targets)) {
      errors.targeting = 'Please update audience targeting rules.';
    }

    return errors;
  }, []);

  return (
    <>
      <Box>
        <TopBreadcrumbs
          trail={[
            { label: 'Library', path: '/library' },
            { label: 'Nps', path: '/library?tab=nps' },
            {
              label: npsNameOrFallback(npsSurvey.name),
            },
          ]}
        />
      </Box>

      <Box>
        <FormsProvider
          formRankings={EditTemplateFormRanks}
          refetch={refetch}
          rootFormDetails={{
            formEntityType: FormEntityType.template,
            entityId: npsSurvey.entityId,
          }}
        >
          <Formik
            validate={validate}
            initialValues={initialValues}
            onSubmit={handleSave}
            enableReinitialize
          >
            <NpsProvider refetch={refetch}>
              <NpsForm />
            </NpsProvider>
          </Formik>
        </FormsProvider>
        <Box height="40px" />
      </Box>
    </>
  );
}

const QUERY = graphql`
  query EditNpsQuery($entityId: EntityId!) {
    npsSurvey(entityId: $entityId) {
      entityId
      name
      question
      state
      fupType
      deletedAt
      fupSettings
      endingType
      launchedAt
      endAt
      startingType
      startAt
      priorityRanking
      endAfterTotalAnswers
      repeatInterval
      pageTargeting {
        type
        url
      }
      targets
    }
    launchedNpsSurveys: npsSurveys(launched: true) {
      ...RankableObjects_surveys @relay(mask: false)
    }
    launchedTemplates: templates(autoLaunchableOnly: true, category: all) {
      ...RankableObjects_templates @relay(mask: false)
    }
  }
`;

function EditNpsQueryRenderer(cProps: CProps) {
  const toast = useToast();
  const router = useRouter();

  const { npsEntityId } = cProps;
  const { data, refetch } = useFetchQuery<EditNpsQuery>({
    query: QUERY,
    variables: { entityId: npsEntityId },
  });

  if (!data) {
    return null;
  }
  if (data && !data.npsSurvey) {
    surveyNotFound(router, toast);
    return null;
  }

  return (
    <AttributesProvider>
      <EditNps {...data} refetch={refetch} />
    </AttributesProvider>
  );
}

export default EditNpsQueryRenderer;
