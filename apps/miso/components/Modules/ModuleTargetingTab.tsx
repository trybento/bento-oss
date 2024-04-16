import React, { useCallback, useMemo } from 'react';
import get from 'lodash/get';

import Box from 'system/Box';
import TemplateSelect from 'components/GuideAutoLaunchModal/TemplateSelect';
import { Flex, FormLabel, Text } from '@chakra-ui/react';
import EditorTabSection from 'components/Templates/Tabs/EditorTabSection';
import RulesContainer from 'components/GuideAutoLaunchModal/FormikRulesContainer';
import { prepareTargetingData } from 'components/GuideAutoLaunchModal/Template/autolaunch.helpers';
import { AttributeType, GroupCondition } from 'bento-common/types';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { ModuleFormValues } from './ModuleForm';
import { SelectOptions } from 'system/Select';
import { useAttributes } from 'providers/AttributesProvider';
import GroupConditionSelect from 'components/GuideAutoLaunchModal/GroupConditionSelect';
import {
  NEW_ACCOUNT_TARGET,
  RULE_GROUP_CONDITIONS,
} from '../EditorCommon/targeting.helpers';
import AddButton from 'components/AddButton';
import DeleteButton from 'system/DeleteButton';
import SimpleInfoTooltip from 'system/SimpleInfoTooltip';

interface Props {
  formKey: string;
}

const ModuleTargetingTab: React.FC<Props> = ({ formKey }) => {
  const { values, setFieldValue } = useFormikContext<ModuleFormValues>();
  const { attributes } = useAttributes();
  const targetingData = get(
    values,
    formKey
  ) as ModuleFormValues['targetingData'];

  const changeHandlers = useMemo(
    () =>
      targetingData.reduce(
        (acc, _, idx) => {
          acc[idx] = {
            targetTemplate: (option) =>
              setFieldValue(`${formKey}[${idx}].targetTemplate`, option.value),
            groupCondition: (option) =>
              setFieldValue(
                `${formKey}[${idx}].autoLaunchContext.accountGroupCondition`,
                option.value
              ),
          };
          return acc;
        },
        {} as Record<
          number,
          {
            targetTemplate: (option: SelectOptions) => void;
            groupCondition: (option: SelectOptions) => void;
          }
        >
      ),
    [formKey, targetingData.length, setFieldValue]
  );

  const handleAddTarget = useCallback(
    ({ push }: FieldArrayRenderProps) =>
      () => {
        push({
          targetTemplate: null,
          autoLaunchContext: prepareTargetingData({
            attributes,
            accountTargets: [NEW_ACCOUNT_TARGET],
            accountUserTargets: [],
            branchingQuestions: [],
          }),
        });
      },
    [attributes]
  );

  const handleDeleteTarget = useCallback(
    ({ remove }: FieldArrayRenderProps, idx: number) =>
      () => {
        remove(idx);
      },
    [attributes]
  );

  return (
    <Box>
      <EditorTabSection
        header="Dynamic targeting"
        helperText="Append this step group to an account's guide based on their attributes"
      >
        <FieldArray
          name={formKey}
          render={(formikHelpers) => {
            return (
              <Flex flexDir="column" bg="gray.50" p="4" gap="4">
                {targetingData.map(
                  ({ targetTemplate, autoLaunchContext }, idx) => {
                    return (
                      <Flex
                        className="row-container"
                        flexDir="column"
                        key={`targeting-data-${idx}`}
                        bg="white"
                        border="1px solid #EDF2F7"
                        borderRadius="md"
                        py="4"
                        px="6"
                        gap="4"
                      >
                        <Flex flexDir="column">
                          <Box display="flex" position="relative" mb="2">
                            <Text my="auto">
                              Launch to all accounts that match
                            </Text>
                            <Box>
                              <GroupConditionSelect
                                defaultValue={
                                  autoLaunchContext.accountGroupCondition
                                }
                                onChange={changeHandlers[idx].groupCondition}
                                options={RULE_GROUP_CONDITIONS}
                              />
                            </Box>
                            <Text my="auto">rules</Text>
                            <SimpleInfoTooltip
                              label={`This is the same as "${
                                autoLaunchContext.accountGroupCondition ===
                                GroupCondition.all
                                  ? 'AND'
                                  : 'OR'
                              }" between each rule`}
                            />
                            <DeleteButton
                              position="absolute"
                              top="0"
                              right="0"
                              tooltip="Delete target"
                              tooltipPlacement="top"
                              className="row-hoverable-btn-80"
                              onClick={handleDeleteTarget(formikHelpers, idx)}
                            />
                          </Box>

                          <RulesContainer
                            formKey={`${formKey}[${idx}].autoLaunchContext`}
                            attributeOptions={autoLaunchContext.accountOptions}
                            attributeType={AttributeType.account}
                            flex="1"
                            deleteLastDisabled
                          />
                        </Flex>

                        <Flex flexDir="column">
                          <FormLabel>Target template</FormLabel>
                          <TemplateSelect
                            onboardingOnly
                            value={targetTemplate}
                            onChange={changeHandlers[idx].targetTemplate}
                          />
                        </Flex>
                      </Flex>
                    );
                  }
                )}
                <Box>
                  <AddButton onClick={handleAddTarget(formikHelpers)}>
                    Add target template
                  </AddButton>
                </Box>
              </Flex>
            );
          }}
        />
      </EditorTabSection>
    </Box>
  );
};

export default ModuleTargetingTab;
