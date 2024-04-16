import QueryRenderer from 'components/QueryRenderer';
import { graphql } from 'react-relay';
import GuideAnalyticsComponent, {
  GuideAnalyticsComponentProps,
} from './GuideAnalyticsComponent';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import { TABLE_SPINNER_SIZE } from 'helpers/constants';
import { Flex } from '@chakra-ui/react';
import TemplateCard from 'components/SplitTest/TemplateCard';
import { SplitTestAnalyticsQuery } from 'relay-types/SplitTestAnalyticsQuery.graphql';

export const QUERY = graphql`
  query SplitTestAnalyticsQuery(
    $templateEntityId: EntityId!
    $useLocked: Boolean
  ) {
    splitTest: findTemplate(entityId: $templateEntityId) {
      splitTargets {
        ...EditSplitTest_splitTarget @relay(mask: false)
        ...GuideAnalytics_template @relay(mask: false)
      }
    }
  }
`;

type Props = Pick<GuideAnalyticsComponentProps, 'templateEntityId'>;

export default function SplitTestAnalyticsQueryRenderer(cProps: Props) {
  const { templateEntityId } = cProps;
  return (
    <QueryRenderer<SplitTestAnalyticsQuery>
      query={QUERY}
      variables={{
        templateEntityId,
        useLocked: true,
      }}
      fetchPolicy="store-and-network"
      render={({ props, retry }) => {
        if (props) {
          return (
            <Flex flexDir="column" gap="4">
              {props.splitTest.splitTargets.map((template) => (
                <TemplateCard template={template} minH="92px" maxW="800px">
                  <GuideAnalyticsComponent
                    {...cProps}
                    template={template}
                    onRefetch={retry}
                    gap="10"
                    flexDir={['column', 'column', 'row', 'row']}
                    flexWrap="wrap"
                  />
                </TemplateCard>
              ))}
            </Flex>
          );
        }

        return <BentoLoadingSpinner h="70vh" size={TABLE_SPINNER_SIZE} />;
      }}
    />
  );
}
