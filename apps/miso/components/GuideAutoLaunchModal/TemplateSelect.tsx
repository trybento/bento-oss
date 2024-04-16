import React, { useCallback, useMemo } from 'react';
import { graphql } from 'react-relay';
import { GuideDesignType } from 'bento-common/types';
import { guidePrivateOrPublicNameOrFallback } from 'bento-common/utils/naming';

import Select from 'system/Select';
import QueryRenderer from 'components/QueryRenderer';
import { TemplateSelectQuery } from 'relay-types/TemplateSelectQuery.graphql';
import { useInternalGuideNames } from 'hooks/useFeatureFlag';
import { TemplateOverflowMenuButton_template$data } from 'relay-types/TemplateOverflowMenuButton_template.graphql';

interface TemplateSelectQueryRenderProps {
  value: string;
  isDisabled?: boolean;
  onboardingOnly?: boolean;
  onChange: (option: { label: string; value: string }) => void;
  currentTemplate?: TemplateOverflowMenuButton_template$data;
}

interface TemplateSelectProps extends TemplateSelectQueryRenderProps {
  templates?: TemplateSelectQuery['response']['templates'];
}

function TemplateSelect(props: TemplateSelectProps) {
  const { value, onChange, templates = [], onboardingOnly } = props;
  const enabledPrivateNames = useInternalGuideNames();

  const targetOptions = useMemo(() => {
    return templates
      .filter(
        (t) =>
          !props.currentTemplate ||
          t.entityId !== props.currentTemplate.entityId
      )
      .reduce((acc, t) => {
        if (!onboardingOnly || t.designType === GuideDesignType.onboarding) {
          acc.push({
            label: guidePrivateOrPublicNameOrFallback(enabledPrivateNames, t),
            value: t.entityId,
          });
        }

        return acc;
      }, []);
  }, [templates, onboardingOnly, enabledPrivateNames]);

  const getTargetOption = useCallback(
    (targetEntityId) => {
      if (!targetEntityId) return null;

      return targetOptions.find((o) => o.value === targetEntityId);
    },
    [targetOptions]
  );

  return (
    <Select
      placeholder="Type to search"
      value={getTargetOption(value)}
      isSearchable={true}
      options={targetOptions}
      onChange={onChange}
      styles={{
        container: (provided) => {
          return {
            ...provided,
            flex: 1,
          };
        },
      }}
    />
  );
}

const TEMPLATE_SELECT_QUERY = graphql`
  query TemplateSelectQuery {
    templates {
      entityId
      name
      privateName
      designType
    }
  }
`;

export default function TemplateSelectQueryRenderer(
  cProps: TemplateSelectQueryRenderProps
) {
  return (
    <QueryRenderer<TemplateSelectQuery>
      query={TEMPLATE_SELECT_QUERY}
      fetchPolicy="store-or-network"
      render={({ props }) => {
        return <TemplateSelect {...cProps} {...props} />;
      }}
    />
  );
}
