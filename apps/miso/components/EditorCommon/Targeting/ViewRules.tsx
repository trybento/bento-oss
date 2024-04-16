import React from 'react';
import { Button, Flex, HStack } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import { AttributeType, RulesDisplayType } from 'bento-common/types';

import OptionGroupBox from 'system/OptionGroupBox';
import { TargetingForm } from '../GroupTargetingEditor.helpers';
import AudienceGroupRulesDisplay from 'components/Templates/AudienceGroupRulesDisplay';
import { GroupTargetingEditorProps } from './groupTargeting.types';
import H6 from 'system/H6';
import { useTargetingAudiencesContext } from '../Audiences/TargetingAudiencesProvider';
import AudienceUsed from '../Audiences/AudienceUsed';
import { GroupTargeting } from 'bento-common/types/targeting';

interface ViewRulesProps extends GroupTargetingEditorProps {
  onEditClicked: () => void;
}

interface ViewRulesDisplayProps {
  onEditClicked?: ViewRulesProps['onEditClicked'];
  values: GroupTargeting;
}

export const ViewRulesDisplay: React.FC<
  React.PropsWithChildren<ViewRulesDisplayProps>
> = ({ onEditClicked, values }) => {
  return (
    <Flex gap="6" flexDirection="column">
      <Flex flexDirection="column" gap="2">
        <Flex alignItems="center">
          <H6 flexGrow="1">Account rules:</H6>
          {onEditClicked && (
            <Button variant="secondary" size="sm" onClick={onEditClicked}>
              Edit
            </Button>
          )}
        </Flex>
        <AudienceGroupRulesDisplay
          targets={values}
          hideBlockedAccounts
          hideRulesTextCopy
          hideSection={AttributeType.accountUser}
          fullWidth
          type={RulesDisplayType.plain}
        />
      </Flex>

      <Flex flexDirection="column" gap="2">
        <H6 flexGrow="1">User rules:</H6>
        <AudienceGroupRulesDisplay
          targets={values}
          hideBlockedAccounts
          hideRulesTextCopy
          fullWidth
          hideSection={AttributeType.account}
          type={RulesDisplayType.plain}
        />
      </Flex>
    </Flex>
  );
};

const ViewRules: React.FC<ViewRulesProps> = ({
  onEditClicked,
  viewControls,
}) => {
  const { values } = useFormikContext<TargetingForm>();
  const { selectedAudience } = useTargetingAudiencesContext();

  return (
    <OptionGroupBox p={4}>
      <ViewRulesDisplay
        onEditClicked={onEditClicked}
        values={values.targeting}
      />
      <HStack justifyContent="space-between" alignItems="baseline">
        {viewControls}
        {selectedAudience ? (
          <Flex justifyContent="flex-end">
            <AudienceUsed audienceName={selectedAudience.name} />
          </Flex>
        ) : (
          <Flex />
        )}
      </HStack>
    </OptionGroupBox>
  );
};

export default ViewRules;
