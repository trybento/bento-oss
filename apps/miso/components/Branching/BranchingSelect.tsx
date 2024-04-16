import React, { useCallback, useMemo } from 'react';
import OpenInNew from '@mui/icons-material/OpenInNew';
import {
  moduleNameOrFallback,
  guideNameOrFallback,
} from 'bento-common/utils/naming';

import { useAllTemplates } from 'providers/AllTemplatesProvider';
import { useAllModules } from 'providers/AllModulesProvider';
import Select, {
  newOptionHighlight,
  OptionWithSubLabel,
  SelectOptions,
  ExtendedSelectOptions,
  SelectProps,
} from 'system/Select';
import {
  MODULE_ALIAS_SINGULAR,
  NO_MODULE_PLACEHOLDER,
} from 'helpers/constants';
import { getBranchingTypesInModule } from 'helpers';
import { isBranchingTypeSupported } from 'bento-common/data/helpers';
import { BranchingEntityType, Theme } from 'bento-common/types';
import { BranchingType } from 'bento-common/types/templateData';

type BranchingSelectProps = {
  /** Type of select options that should be presented */
  type: BranchingType;
  /** Selected entity id (aka branching path) */
  value: string;
  /** Determines the current template/module entity id to be filtered out */
  templateEntityId?: string;
  /** Underlying react-select component props */
  select: Omit<
    SelectProps,
    'value' | 'components' | 'styles' | 'isLoading' | 'isCreatable'
  >;
  /** Theme of current template being edited, if applicable */
  theme: Theme | undefined;
  /** isCyoa of current template/stepGroup being edited, if applicable */
  isCyoa: boolean | undefined;
};

/**
 * Branch select dropdown.
 *
 * Allow admins to select branching paths when editing templates and modules.
 *
 * WARNING: This requires being wrapped in the `AllTemplatesProvider` and
 * `AllModulesProvider`, otherwise the needed context wont be available.
 */
const BranchingSelect: React.FC<BranchingSelectProps> = ({
  type,
  value,
  templateEntityId,
  select,
  theme,
  isCyoa,
}) => {
  const { isLoading: isLoadingTemplates, reusableTemplates: templates } =
    useAllTemplates();
  const { isLoading: isLoadingModules, modules } = useAllModules();

  const options = useMemo<(SelectOptions | ExtendedSelectOptions)[]>(() => {
    switch (type) {
      case BranchingType.guide:
        return [
          getCreateNewOption(BranchingType.guide),
          ...templates
            // filter out the current template, if available
            .filter((t) => t.entityId !== templateEntityId && !t.isCyoa)
            .map((t) => ({
              label: guideNameOrFallback(t.name),
              value: t.entityId,
              extra: {
                title: 'Open in new window',
                icon: OpenInNew,
                callback: () =>
                  window.open(`/library/templates/${t.entityId}`, '_blank'),
              },
            })),
        ];

      case BranchingType.module:
        return [
          getCreateNewOption(BranchingType.module),
          NO_MODULE_OPTION,
          ...modules.reduce((acc, m) => {
            const branchingTypesInModule = getBranchingTypesInModule(m) || [];

            // Check if all branching types are supported.
            const areBranchingTypesSupported = branchingTypesInModule.every(
              (bt) =>
                isBranchingTypeSupported({
                  entityType: bt as BranchingEntityType,
                  theme,
                  isCyoa,
                })
            );

            if (areBranchingTypesSupported)
              acc.push({
                label: moduleNameOrFallback(m),
                value: m.entityId,
                extra: {
                  title: 'Open in new window',
                  icon: OpenInNew,
                  callback: () =>
                    window.open(`/library/step-groups/${m.entityId}`, '_blank'),
                },
              });

            return acc;
          }, []),
        ];

      default:
        return [];
    }
  }, [type, templates, modules, templateEntityId]);

  const selectedOption = useMemo(() => {
    return options.find((o) => o.value === value);
  }, [value, options]);

  const isLoading = useMemo<boolean>(() => {
    switch (type) {
      case BranchingType.guide:
        return isLoadingTemplates;
      case BranchingType.module:
        return isLoadingModules;
      default:
        return false;
    }
  }, [type, isLoadingTemplates, isLoadingModules]);

  return (
    <Select
      placeholder="Type to search"
      loadingMessage={useCallback(() => 'Loading...', [])}
      {...select}
      // WARNING: Things below can't be overridden
      options={options}
      value={selectedOption}
      isLoading={isLoading}
      menuPortalTarget={document.body}
      components={{
        Option: OptionWithSubLabel(),
      }}
      styles={{
        container: (provided) => {
          return {
            ...provided,
            flex: 1,
          };
        },
        option: (provided, state) => {
          return {
            ...provided,
            ...newOptionHighlight(state),
          };
        },
      }}
    />
  );
};

const getCreateNewOption = (type: BranchingType): SelectOptions => ({
  value: '',
  label: `+ Create a new ${
    type === BranchingType.module ? MODULE_ALIAS_SINGULAR : type
  }`,
});

export const NO_MODULE_OPTION = {
  value: NO_MODULE_PLACEHOLDER,
  label: `No ${MODULE_ALIAS_SINGULAR}`,
} as SelectOptions;

export default BranchingSelect;
