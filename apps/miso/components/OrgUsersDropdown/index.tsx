import React, { useMemo } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { components, OptionProps, SingleValueProps } from 'react-select';

import Avatar from 'system/Avatar';
import Box from 'system/Box';
import Select from 'system/Select';
import Text from 'system/Text';

import { OrgUsersDropdown_users$data } from 'relay-types/OrgUsersDropdown_users.graphql';

type OptionType = {
  label: string;
  value: string;
  avatarUrl?: string;
};

interface OrgUsersDropdownProps {
  users: OrgUsersDropdown_users$data;
  selectedValue: string | null;
  onChange: (userEntityId: string) => void;
  additionalOptions?: OptionType[];
  disabled?: boolean;
}

function OrgUsersDropdown(props: OrgUsersDropdownProps) {
  const {
    users,
    selectedValue,
    additionalOptions = [],
    onChange,
    disabled,
  } = props;

  const userOptions = useMemo(
    () =>
      users.filter(Boolean).map((user) => ({
        label: user.fullName,
        value: user.entityId,
        avatarUrl: user.avatarUrl,
      })),
    [users]
  );

  const options = [...additionalOptions, ...userOptions];

  let selectedOption: OptionType | undefined;
  if (selectedValue) {
    selectedOption = options.find((option) => option.value === selectedValue);
  }

  const handleChange = (option: OptionType) => {
    onChange(option.value);
  };

  return (
    <Box>
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        isDisabled={disabled}
        components={{
          Option: ({
            children: _children,
            ...props
          }: OptionProps<any, any>) => (
            <components.Option {...props}>
              <Box display="flex" alignItems="center">
                <Text
                  ml={1}
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {props.data.label}
                </Text>
                {props.data.avatarUrl ? (
                  <Box ml="2">
                    <Avatar
                      size="xs"
                      name={props.data.label}
                      src={props.data.avatarUrl}
                    />
                  </Box>
                ) : null}
              </Box>
            </components.Option>
          ),
          SingleValue: ({
            children: _children,
            ...props
          }: SingleValueProps<any>) => (
            <components.SingleValue {...props}>
              <Box display="flex" alignItems="center">
                <Text fontWeight="semibold">{`CSM: `}</Text>
                <Text
                  ml={1}
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {props.data.label}
                </Text>
                {props.data.avatarUrl ? (
                  <Box ml="2">
                    <Avatar
                      size="xs"
                      name={props.data.label}
                      src={props.data.avatarUrl}
                    />
                  </Box>
                ) : null}
              </Box>
            </components.SingleValue>
          ),
        }}
        styles={{
          container: (provided) => ({
            ...provided,
            width: '100%',
            padding: '1px',
          }),
        }}
      />
    </Box>
  );
}

export default createFragmentContainer(OrgUsersDropdown, {
  users: graphql`
    fragment OrgUsersDropdown_users on User @relay(plural: true) {
      fullName
      entityId
      avatarUrl
      email
    }
  `,
}) as unknown as typeof OrgUsersDropdown;
