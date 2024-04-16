import { graphql } from 'react-relay';

export const AUDIENCE_RULE_FRAGMENT = graphql`
  fragment AudienceRule_targets on AudienceRule {
    targets {
      account {
        type
        groups {
          rules {
            attribute
            ruleType
            valueType
            value
          }
        }
      }
      accountUser {
        type
        groups {
          rules {
            attribute
            ruleType
            valueType
            value
          }
        }
      }
    }
  }
`;
