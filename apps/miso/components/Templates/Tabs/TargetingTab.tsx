import React, { FC, useCallback } from 'react';

import { StepPrototype } from '../../Tags/StepPrototypeTag';
import { TemplateFormValues } from '../Template';
import { EditTemplateQuery } from 'relay-types/EditTemplateQuery.graphql';
import { TemplateForm } from '../EditTemplate';

import RuleBasedLaunching from './Targeting/RuleBasedLaunching';
import LaunchedByTemplates from './Targeting/LaunchedByTemplates';
import { useTemplate } from 'providers/TemplateProvider';

export type TargetingTabProps = {
  template: TemplateForm;
  stepPrototype: StepPrototype | undefined;
  autoLaunchableTemplates: EditTemplateQuery['response']['autoLaunchableTemplates'];
  launchedNpsSurveys: EditTemplateQuery['response']['launchedNpsSurveys'];
  currentValues: TemplateFormValues;
};

const TargetingTab: FC<TargetingTabProps> = (props) => {
  const { currentValues } = props;
  const { handleTargetingChange, setManuallyEnableLaunchButton } =
    useTemplate();

  const editedTemplateName =
    currentValues.templateData?.privateName || currentValues.templateData?.name;

  const onRuleEditingDone = useCallback(() => {
    setManuallyEnableLaunchButton(true);
  }, []);

  return (
    <>
      <LaunchedByTemplates {...props} />
      <RuleBasedLaunching
        {...props}
        editedTemplateName={editedTemplateName}
        onEditingDone={onRuleEditingDone}
        onTargetingSubmit={handleTargetingChange}
      />
    </>
  );
};

export default TargetingTab;
