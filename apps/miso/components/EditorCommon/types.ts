import { AttributeType } from 'bento-common/types';
import {
  RuleTypeEnum,
  SupportedAttributeValueTypes,
} from 'bento-common/types/targeting';

import { AttributesQuery_attributes } from 'providers/AttributesProvider';

export type EditorWrapperTab<T extends string> = {
  title: T;
  isDisabled?: boolean;
};

/** Rules formatted to display correctly in Miso forms */
export type FormattedRules = {
  /** Mapped from the results of Attribute Provider, etc. */
  attribute: AttributesQuery_attributes;
  attributeType: AttributeType;
  value: SupportedAttributeValueTypes;
  condition: {
    label: string;
    value: RuleTypeEnum;
    default: boolean;
  };
};
