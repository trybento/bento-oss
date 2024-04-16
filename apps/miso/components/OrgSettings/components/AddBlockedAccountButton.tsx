import React, { forwardRef, useCallback, useLayoutEffect, useRef } from 'react';
import { BoxProps, Button } from '@chakra-ui/react';

import Box from 'system/Box';
import { ModuleOption } from 'types';
import RuleAttributeValueSelect from 'components/GuideAutoLaunchModal/RuleAttributeValueSelect';
import { AttributeType } from 'bento-common/types';
import AddButton from 'components/AddButton';

type Props = {
  id?: string;
  handleAddBlockedAccount: (accountName: string) => void;
} & BoxProps;

const AddBlockedAccountButton = forwardRef(
  (
    { id, handleAddBlockedAccount, ...boxProps }: Props,
    ref: React.Ref<HTMLDivElement>
  ) => {
    // @see https://react-select.com/props
    const dropdownRef = useRef(null);

    const [isAddBlockedAccountDisplayed, setIsAddBlockedAccountDisplayed] =
      React.useState<boolean>(false);

    const handleOnChange = useCallback(
      (option: ModuleOption) => {
        handleAddBlockedAccount(option.value);
        setIsAddBlockedAccountDisplayed(false);
      },
      [handleAddBlockedAccount]
    );

    const handleFocus = useCallback(() => {
      setIsAddBlockedAccountDisplayed(true);
    }, []);

    useLayoutEffect(() => {
      isAddBlockedAccountDisplayed && dropdownRef.current?.inputRef?.focus();
    }, [isAddBlockedAccountDisplayed]);

    return (
      <Box mt={4} minW="200px" maxWidth="360px" ref={ref} {...boxProps}>
        {isAddBlockedAccountDisplayed ? (
          <RuleAttributeValueSelect
            attributeName="name"
            attributeType={AttributeType.account}
            placeholder="Select account to block"
            onChange={handleOnChange}
            isCreatable={false}
          />
        ) : (
          <Button variant="secondary" p="4">
            <AddButton fontSize="md" onClick={handleFocus}>
              Add blocked account
            </AddButton>
          </Button>
        )}
      </Box>
    );
  }
);

export default AddBlockedAccountButton;
