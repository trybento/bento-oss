import { OrgSettingsProps } from '.';

export type OrgSettingValues = OrgSettingsProps['initialValues'];

export type TabPanelProps = {
  debounceSetFieldValue: (setValueFieldFunc, val, newValue) => void;
  values: OrgSettingValues;
  propValues: OrgSettingValues;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  refetch?: () => void;
};
