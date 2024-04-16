import { graphql } from 'react-relay';

export const STEP_INPUT_SETTINGS_FRAGMENT = graphql`
  fragment StepInput_settings on InputSettings {
    ... on TextOrEmailSettings {
      placeholder
      required
      helperText
      maxValue
    }
    ... on NpsSettings {
      required
      helperText
    }
    ... on NumberPollSettings {
      required
      helperText
      minLabel
      minValue
      maxLabel
      maxValue
    }
    ... on DropdownSettings {
      required
      multiSelect
      variation
      options {
        label
        value
      }
    }
  }
`;
