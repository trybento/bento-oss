import { FormFactorStateKey } from 'bento-common/types/globalShoyuState';
import { EmbedFormFactor } from 'bento-common/types';
import { capitalizeFirstLetter } from 'bento-common/utils/strings';

import { formFactorSelector } from '../stores/mainStore/helpers/selectors';
import { FormFactorFlags } from '../../types/global';
import mainStore from '../stores/mainStore';

export const formFactorHelper =
  (embedFormFactor: EmbedFormFactor) =>
  (formFactor: FormFactorStateKey | undefined): boolean =>
    !!formFactor &&
    formFactorSelector(mainStore.getState(), formFactor)?.formFactor ===
      embedFormFactor;

export const isInline = formFactorHelper(EmbedFormFactor.inline);
export const isSidebar = formFactorHelper(EmbedFormFactor.sidebar);
export const isModal = formFactorHelper(EmbedFormFactor.modal);
export const isBanner = formFactorHelper(EmbedFormFactor.banner);
export const isTooltip = formFactorHelper(EmbedFormFactor.tooltip);

export const getFormFactorFlags = (
  formFactor: FormFactorStateKey
): FormFactorFlags =>
  Object.fromEntries(
    Object.entries(EmbedFormFactor).map(
      ([embedFormFactorKey, embedFormFactorValue]) => [
        `is${capitalizeFirstLetter(embedFormFactorKey)}`,
        formFactorHelper(embedFormFactorValue)(formFactor),
      ]
    )
  ) as FormFactorFlags;

export const isInlineEmbed = (ff: EmbedFormFactor) =>
  ff === EmbedFormFactor.inline;
export const isSidebarEmbed = (ff: EmbedFormFactor) =>
  ff === EmbedFormFactor.sidebar;
export const isModalEmbed = (ff: EmbedFormFactor) =>
  ff === EmbedFormFactor.modal;
export const isBannerEmbed = (ff: EmbedFormFactor) =>
  ff === EmbedFormFactor.banner;
export const isTooltipEmbed = (ff: EmbedFormFactor) =>
  ff === EmbedFormFactor.tooltip;
export const isFlowEmbed = (ff: EmbedFormFactor) => ff === EmbedFormFactor.flow;

const embedCheckers: {
  [k in keyof FormFactorFlags]: (ff: EmbedFormFactor) => boolean;
} = {
  isInline: isInlineEmbed,
  isSidebar: isSidebarEmbed,
  isModal: isModalEmbed,
  isBanner: isBannerEmbed,
  isTooltip: isTooltipEmbed,
  isFlow: isFlowEmbed,
};

export const getEmbedFormFactorFlags = (
  formFactor: EmbedFormFactor
): FormFactorFlags =>
  Object.fromEntries(
    Object.entries(embedCheckers).map(([key, checker]) => [
      key,
      checker(formFactor),
    ])
  ) as FormFactorFlags;

const ResponsiveClassNamesPrefix: Record<
  EmbedFormFactor.inline | EmbedFormFactor.sidebar,
  string
> = {
  [EmbedFormFactor.inline]: 'bento-inline-sm',
  [EmbedFormFactor.sidebar]: 'bento-sidebar',
};

const partialResponsiveClassNames = {
  header: 'header',
  headerContent: 'header-content',
  headerTitle: 'header-title',
  headerSubtitle: 'header-subtitle',
};

export type ResponsiveClassNames = Record<
  keyof typeof partialResponsiveClassNames,
  string
>;

type ResponsiveFormFactorClassNames = Record<
  keyof typeof ResponsiveClassNamesPrefix,
  ResponsiveClassNames
>;

/**
 * Keep apps\miso\public\bento-template.css
 * in sync with these classNames.
 */
export const responsiveClassNames = Object.entries(
  ResponsiveClassNamesPrefix
).reduce((acc, [ff, classNamePrefix]) => {
  acc[ff] = Object.entries(partialResponsiveClassNames).reduce(
    (cAcc, [cField, cName]) => {
      cAcc[cField] = `${classNamePrefix}-${cName}`;
      return cAcc;
    },
    {}
  );
  return acc;
}, {} as ResponsiveFormFactorClassNames);
