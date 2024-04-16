import React, { useCallback, useEffect, useMemo } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { Formik, useFormikContext } from 'formik';
import { AttributeType, GroupCondition, Mutable } from 'bento-common/types';
import { CommonTargeting, TargetingType } from 'bento-common/types/targeting';
import {
  accountFieldKeys,
  accountUserFieldKeys,
  RULE_GROUP_CONDITIONS,
} from 'components/EditorCommon/targeting.helpers';
import RulesContainer from 'components/GuideAutoLaunchModal/FormikRulesContainer';
import GroupConditionSelect from 'components/GuideAutoLaunchModal/GroupConditionSelect';
import TargetingBlockedAccounts from '../Templates/Tabs/Targeting/BlockedAccounts';
import { useAttributes } from 'providers/AttributesProvider';
import Box from 'system/Box';
import OptionGroupBox from 'system/OptionGroupBox';
import Radio from 'system/Radio';
import RadioGroup from 'system/RadioGroup';
import SimpleInfoTooltip from 'system/SimpleInfoTooltip';
import { FormattedRules } from './types';
import BlockedAccountsQuery from 'queries/BlockedAccountsQuery';
import { useQueryAsHook } from 'hooks/useQueryAsHook';
import LoadingState from 'components/system/LoadingState';

type OuterProps = {
  disabled?: boolean;
  targeting: CommonTargeting<FormattedRules>;
  onChange: (args: {
    targeting: CommonTargeting<FormattedRules>;
    dirty: boolean;
  }) => void;
  hideBlockedAccounts?: boolean;
};

const targetingKey = 'targeting';

type Props = OuterProps & {
  accountOptions: any[];
  accountUserOptions: any[];
};

type TargetingForm = {
  targeting: CommonTargeting<FormattedRules>;
};

const TargetingEditorComponent: React.FC<Props> = ({
  disabled,
  hideBlockedAccounts,
  onChange,
  accountOptions,
  accountUserOptions,
}) => {
  const { setFieldValue, values, dirty } = useFormikContext<TargetingForm>();

  const { loading, data } = useQueryAsHook(BlockedAccountsQuery, {});

  const {
    type: accountTargetType,
    grouping: accountGroupCondition = GroupCondition.all,
  } = values.targeting.account;
  const {
    type: accountUserTargetType,
    grouping: accountUserGroupCondition = GroupCondition.all,
  } = values.targeting.accountUser;

  /** For future, e.g. guide base level */
  const hideAccountTargeting = false;

  useEffect(() => {
    onChange({
      targeting: values.targeting,
      dirty,
    });
  }, [values, dirty]);

  const handleAccountTargetTypeChange = useCallback((opt: TargetingType) => {
    setFieldValue(`${targetingKey}.account.type`, opt);
  }, []);

  const handleAccountUserTargetTypeChange = useCallback(
    (opt: TargetingType) => {
      setFieldValue(`${targetingKey}.accountUser.type`, opt);
    },
    []
  );
  const handleAccountGroupConditionChange = useCallback(
    (opt: GroupCondition) => {
      setFieldValue(`${targetingKey}.account.grouping`, opt);
    },
    []
  );
  const handleAccountUserGroupConditionChange = useCallback(
    (opt: GroupCondition) => {
      setFieldValue(`${targetingKey}.account.grouping`, opt);
    },
    []
  );

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Flex direction="column" gap={4}>
      {!hideAccountTargeting && (
        <Box>
          <Text fontSize="sm" fontWeight="semibold" mb={2}>
            Which accounts?
          </Text>
          <RadioGroup
            defaultValue={TargetingType.all}
            alignment="horizontal"
            isDisabled={disabled}
            value={accountTargetType}
            onChange={handleAccountTargetTypeChange}
          >
            <Radio value={TargetingType.all} label="All accounts" />
            <Radio value={TargetingType.attributeRules} label="Some accounts" />
          </RadioGroup>
          {!hideBlockedAccounts && (
            <TargetingBlockedAccounts
              blockedAccounts={data?.accounts}
              p="0"
              mt="2"
            />
          )}
          {accountTargetType === TargetingType.attributeRules && (
            <OptionGroupBox mt="2">
              <Flex mb="2" alignItems="center">
                <Text>Launch to accounts which match</Text>
                <Box>
                  <GroupConditionSelect
                    defaultValue={accountGroupCondition}
                    onChange={handleAccountGroupConditionChange}
                    options={RULE_GROUP_CONDITIONS}
                    disabled={disabled}
                  />
                </Box>
                <Text mr="1">rules</Text>
                <SimpleInfoTooltip
                  label={`This is the same as "${
                    accountGroupCondition === GroupCondition.all ? 'AND' : 'OR'
                  }" between each rule`}
                />
              </Flex>
              <RulesContainer
                formKey={targetingKey}
                disabled={disabled}
                fieldKeys={accountFieldKeys}
                attributeOptions={accountOptions}
                attributeType={AttributeType.account}
              />
            </OptionGroupBox>
          )}
        </Box>
      )}

      <Box>
        <Text fontSize="sm" fontWeight="semibold" mb={2}>
          Which users?
        </Text>
        <RadioGroup
          defaultValue={TargetingType.all}
          alignment="horizontal"
          isDisabled={disabled}
          value={accountUserTargetType}
          onChange={handleAccountUserTargetTypeChange}
        >
          <Radio value={TargetingType.all} label="All users" />
          <Radio value={TargetingType.attributeRules} label="Some users" />
        </RadioGroup>
        {accountUserTargetType === TargetingType.attributeRules && (
          <OptionGroupBox mt="2">
            <Flex mb="2" alignItems="center">
              <Text>Launch to users who match</Text>
              <Box>
                <GroupConditionSelect
                  defaultValue={accountUserGroupCondition}
                  onChange={handleAccountUserGroupConditionChange}
                  options={RULE_GROUP_CONDITIONS}
                  disabled={disabled}
                />
              </Box>
              <Text mr="1">rules</Text>
              <SimpleInfoTooltip
                label={`This is the same as "${
                  accountUserGroupCondition === GroupCondition.all
                    ? 'AND'
                    : 'OR'
                }" between each rule`}
              />
            </Flex>
            <RulesContainer
              formKey={targetingKey}
              disabled={disabled}
              fieldKeys={accountUserFieldKeys}
              attributeOptions={accountUserOptions}
              attributeType={AttributeType.accountUser}
            />
          </OptionGroupBox>
        )}
      </Box>
    </Flex>
  );
};

/**
 * Uses a Formik context, but it is not responsible for saving
 *   Values reported back with onChange, and parent component should
 *   handle persisting and what to do with the data.
 */
const TargetingEditor: React.FC<OuterProps> = (props) => {
  const { targeting } = props;

  const { accountAttributes, accountUserAttributes } = useAttributes();

  const initialValues = useMemo(() => {
    return { targeting };
  }, [targeting]);

  /** Not needed, component that implements this should handle save */
  const handleSubmit = useCallback(() => {}, []);

  if (!targeting) return;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <TargetingEditorComponent
        {...props}
        accountOptions={accountAttributes as Mutable<typeof accountAttributes>}
        accountUserOptions={
          accountUserAttributes as Mutable<typeof accountUserAttributes>
        }
      />
    </Formik>
  );
};

export default TargetingEditor;
