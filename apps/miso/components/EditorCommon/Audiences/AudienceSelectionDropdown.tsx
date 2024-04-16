import React, { useCallback, useMemo } from 'react';
import { Flex, FlexProps, useBoolean } from '@chakra-ui/react';
import OpenInNew from '@mui/icons-material/OpenInNew';

import Select, {
  ExtendedSelectOptions,
  OptionWithSubLabel,
} from 'system/Select';
import { useTargetingAudiencesContext } from './TargetingAudiencesProvider';
import { Audiences } from 'hooks/useSelectedAudience';
import { AudiencePopoverItem } from './AudiencePopoverItem';
import { GroupTargeting } from 'bento-common/types/targeting';

export type AudienceOption = Omit<Audiences[number], 'name' | 'entityId'> & {
  label: string;
  value: string;
} & ExtendedSelectOptions;

type Props = {
  disabled?: boolean;
  /** Returns the audience's entityId */
  onChange: (value: string) => void;
  value?: string;
} & Omit<FlexProps, 'onChange'>;

/**
 * Requires the TargetingAudienceContext
 */
const AudienceSelectionDropdown: React.FC<Props> = ({
  disabled,
  onChange,
  value,
  ...flexProps
}) => {
  const { audiences } = useTargetingAudiencesContext();
  const [isMenuOpen, setIsMenuOpen] = useBoolean(false);

  const handleOnChange = useCallback(
    (opt: AudienceOption) => {
      onChange(opt.value);
    },
    [onChange]
  );

  const options: AudienceOption[] = useMemo(
    () =>
      audiences.map(({ name, entityId, ...rest }) => ({
        label: name,
        value: entityId,
        element: (
          <AudiencePopoverItem
            entityId={entityId}
            audienceEntityId={entityId}
            name={name}
            {...(rest as any)}
          />
        ),
        ...rest,
      })),
    [audiences]
  );

  const selected = useMemo(() => {
    return value ? options.find((o) => o.value === value) : undefined;
  }, [options, value]);

  return (
    <Flex flexDir="column" gap="1" w="320px" {...flexProps}>
      <AudiencePopoverItem
        audienceEntityId={selected?.value}
        targets={selected?.targets as GroupTargeting}
        isDisabled={!selected || isMenuOpen}
      >
        <Select
          isDisabled={disabled}
          placeholder="Search for a saved audience"
          value={selected}
          options={options}
          onChange={handleOnChange}
          components={{
            Option: OptionWithSubLabel(),
          }}
          onMenuClose={setIsMenuOpen.off}
          onMenuOpen={setIsMenuOpen.on}
        />
      </AudiencePopoverItem>
    </Flex>
  );
};

export default AudienceSelectionDropdown;
