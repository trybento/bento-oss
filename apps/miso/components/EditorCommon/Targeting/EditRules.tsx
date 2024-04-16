import React, { useCallback, useMemo } from 'react';
import { Button, Flex, HStack, Text } from '@chakra-ui/react';
import { FieldArray, useFormikContext } from 'formik';
import { AttributeType } from 'bento-common/types';
import { TargetingType } from 'bento-common/types/targeting';

import {
  attributesFilter,
  TEMPLATE_OPTIONS,
} from 'components/EditorCommon/targeting.helpers';
import GroupRulesContainer from '../GroupRulesContainer';
import { useAttributes } from 'providers/AttributesProvider';
import Box from 'system/Box';
import OptionGroupBox from 'system/OptionGroupBox';
import Radio from 'system/Radio';
import RadioGroup from 'system/RadioGroup';
import AddButton from 'components/AddButton';
import { NEW_RULE, TargetingForm } from '../GroupTargetingEditor.helpers';
import { useTemplate } from 'providers/TemplateProvider';
import { BranchingQuestions } from 'queries/BranchingQuestionsQuery';
import HelperText from 'system/HelperText';
import { useTargetingEditorContext } from 'components/Templates/Tabs/Targeting/TargetingEditorProvider';
import MultiButton, { MenuOption } from 'system/MultiButton';
import { useTargetingAudiencesContext } from '../Audiences/TargetingAudiencesProvider';
import { GroupTargetingEditorProps } from './groupTargeting.types';
import AudienceUsed from '../Audiences/AudienceUsed';

interface EditRulesProps extends GroupTargetingEditorProps {
  branchingQuestions: BranchingQuestions;
  onCommit?: () => void;
  onCancelClicked: () => void;
}

const EditRules: React.FC<EditRulesProps> = ({
  branchingQuestions,
  onCancelClicked,
  onCommit,
  lockMode,
}) => {
  const { accountAttributes, accountUserAttributes } = useAttributes();
  const { setFieldValue, values, dirty, isValid, isSubmitting, resetForm } =
    useFormikContext<TargetingForm>();
  const { template } = useTemplate();
  const { persistedPrompt } = useTargetingEditorContext();
  const {
    disableSaveNew,
    disableReason,
    requestSaveAudience,
    selectedAudience,
  } = useTargetingAudiencesContext();

  const handleTargetTypeChanged = useCallback(
    (entity: 'account' | 'accountUser', opt: TargetingType) => {
      const existingGroups = values.targeting[entity].groups;

      setFieldValue(`targeting.${entity}`, {
        type: opt,
        groups:
          opt === TargetingType.all
            ? null
            : existingGroups &&
              existingGroups.length > 0 &&
              existingGroups[0].rules.length > 0
            ? values.targeting[entity].groups
            : [
                {
                  rules: [NEW_RULE],
                },
              ],
      });
    },
    [values.targeting]
  );

  const accountTargets = values.targeting.account;
  const accountUserTargets = values.targeting.accountUser;

  const parsedAccountAttributes = useMemo(
    () => [
      ...attributesFilter(accountAttributes, AttributeType.account),
      ...branchingQuestions.map(({ branchingKey, question, choices }) => ({
        label: `Branching: ${question}`,
        valueType: 'branchingPath',
        name: 'branchingPath',
        // We have to add a "value" property for the Select component.
        choices: choices.map((c) => ({
          ...c,
          value: c.id,
        })),
        value: branchingKey,
        type: AttributeType.account,
      })),
    ],
    [accountAttributes, branchingQuestions]
  );

  const parsedAccountUserAttributes = useMemo(
    () => [
      ...attributesFilter(accountUserAttributes, AttributeType.accountUser),
      ...TEMPLATE_OPTIONS,
    ],
    [accountUserAttributes]
  );

  const handleCancelClicked = useCallback(() => {
    resetForm();
    onCancelClicked();
  }, [resetForm, onCancelClicked]);

  const saveDropdownOptions: MenuOption[] = useMemo(() => {
    return [
      {
        label: 'Save as new audience',
        onClick: requestSaveAudience,
        isDisabled: disableSaveNew || !isValid,
        tooltip: disableReason
          ? disableReason
          : !isValid
          ? 'Make sure you’ve selected attributes, operators, and values'
          : undefined,
      },
    ];
  }, [disableSaveNew, disableReason, isValid]);

  const enableSave = (dirty || !!values.targeting?.audiences) && isValid;

  return (
    <OptionGroupBox>
      <Flex direction="column" gap="8">
        <Flex direction="column" gap="4">
          <Flex alignItems="baseline">
            <Flex flexGrow="1" direction="column" gap="1">
              <Text fontSize="sm" fontWeight="bold">
                Which accounts?
              </Text>
              <RadioGroup
                defaultValue={TargetingType.all}
                alignment="horizontal"
                value={accountTargets.type}
                onChange={(value: TargetingType) =>
                  handleTargetTypeChanged('account', value)
                }
              >
                <Radio value={TargetingType.all} label="All accounts" />
                <Radio
                  value={TargetingType.attributeRules}
                  label="Some accounts"
                />
              </RadioGroup>
            </Flex>
            {!lockMode && (
              <Flex alignItems="baseline" gap="4">
                <Button
                  variant="link"
                  size="sm"
                  fontWeight="bold"
                  onClick={handleCancelClicked}
                  isDisabled={isSubmitting}
                >
                  Cancel
                </Button>
                <MultiButton
                  size="sm"
                  options={saveDropdownOptions}
                  isPrimaryDisabled={!enableSave}
                  onPrimaryClick={onCommit}
                  variant="secondary"
                  placement="bottom-end"
                  label="Save"
                />
              </Flex>
            )}
          </Flex>

          {accountTargets.type === TargetingType.attributeRules && (
            <Flex direction="column" gap="4">
              <FieldArray
                name={'targeting.account.groups'}
                render={({ push, remove }) => {
                  const removeGroup = (idx: number) => {
                    if (accountTargets.groups.length === 1) {
                      setFieldValue(
                        'targeting.account.type',
                        TargetingType.all
                      );
                    }

                    remove(idx);
                  };

                  return (
                    <>
                      {accountTargets.groups?.map((_, idx) => (
                        <Box key={idx}>
                          <GroupRulesContainer
                            groupIdx={idx}
                            attributeOptions={parsedAccountAttributes}
                            attributeType={AttributeType.account}
                            targetingPath="account"
                            removeGroup={() => removeGroup(idx)}
                            template={template}
                          />
                          {accountTargets.groups.length > 1 &&
                            idx !== accountTargets.groups.length - 1 && (
                              <Box pt="4" px="6">
                                <Text>Or</Text>
                              </Box>
                            )}
                        </Box>
                      ))}
                      <Box px="2">
                        <AddButton
                          onClick={() => push({ rules: [NEW_RULE] })}
                          fontSize="sm"
                          iconSize="sm"
                        >
                          Or
                        </AddButton>
                      </Box>
                    </>
                  );
                }}
              />
            </Flex>
          )}
        </Flex>

        <Flex direction="column" gap="4">
          <Flex direction="column" gap="1">
            <Text fontSize="sm" fontWeight="bold">
              Which users?
            </Text>
            <RadioGroup
              defaultValue={TargetingType.all}
              alignment="horizontal"
              value={accountUserTargets.type}
              onChange={(value: TargetingType) =>
                handleTargetTypeChanged('accountUser', value)
              }
            >
              <Radio value={TargetingType.all} label="All users" />
              <Radio value={TargetingType.attributeRules} label="Some users" />
            </RadioGroup>
          </Flex>
          {accountUserTargets.type === TargetingType.attributeRules && (
            <Flex direction="column" gap="4">
              <FieldArray
                name={'targeting.accountUser.groups'}
                render={({ push, remove }) => {
                  const removeGroup = (idx: number) => {
                    if (accountUserTargets.groups.length === 1) {
                      setFieldValue(
                        'targeting.accountUser.type',
                        TargetingType.all
                      );
                    }

                    remove(idx);
                  };

                  return (
                    <>
                      {accountUserTargets.groups?.map((_, idx) => (
                        <Box key={idx}>
                          <GroupRulesContainer
                            groupIdx={idx}
                            attributeOptions={parsedAccountUserAttributes}
                            attributeType={AttributeType.accountUser}
                            targetingPath="accountUser"
                            removeGroup={() => removeGroup(idx)}
                            template={template}
                          />
                          {accountUserTargets.groups.length > 1 &&
                            idx !== accountUserTargets.groups.length - 1 && (
                              <Box pt="4" px="6">
                                <Text>Or</Text>
                              </Box>
                            )}
                        </Box>
                      ))}
                      <Box px="2">
                        <AddButton
                          onClick={() => push({ rules: [NEW_RULE] })}
                          fontSize="sm"
                          iconSize="sm"
                        >
                          Or
                        </AddButton>
                      </Box>
                    </>
                  );
                }}
              />
            </Flex>
          )}
        </Flex>
        <HStack w="full" justifyContent="flex-end">
          {persistedPrompt ? (
            <Flex flexDir="row" gap="4" float="right">
              <HelperText fontStyle="italic">
                Using rules suggested by ✨BentoAI
              </HelperText>
            </Flex>
          ) : selectedAudience && template ? (
            <AudienceUsed audienceName={selectedAudience.name} />
          ) : (
            <Flex />
          )}
        </HStack>
      </Flex>
    </OptionGroupBox>
  );
};

export default EditRules;
