import {
  RawRule,
  SupportedAttributeValueTypes,
} from 'bento-common/types/targeting';

/** RawRule but with transformed data */
export type AttributeRule = Omit<RawRule, 'value'> & {
  value: SupportedAttributeValueTypes | Date;
};

export type AutoLaunchAttributeRules = AttributeRule[];
export type TargetAttributeRules = AttributeRule[];
