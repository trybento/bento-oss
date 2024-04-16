import { FC, VFC } from 'react';

export enum TemplateFilter {
  status = 'Status',
  component = 'Component',
  scope = 'Scope',
  audience = 'Audience',
  user = 'User',
  lastEditedBy = 'Last edited by',
}

export enum GuideComponentFilter {
  onboarding = 'Onboarding checklist',
  cyoa = 'CYOA',
  tooltip = 'Tooltip',
  contextualSidebar = 'Contextual checklist',
  modal = 'Modal',
  banner = 'Banner',
  carousel = 'Carousel',
  card = 'Card',
  videoGallery = 'Video gallery',
  flow = 'Flow',
}

export enum GuideStatusFilter {
  live = 'Live',
  draft = 'Draft',
  stopped = 'Stopped',
  removed = 'Removed',
  template = 'Template',
}

export enum ScopeFilter {
  account = 'Account',
  user = 'User',
}

export type TableFilterLabel = TemplateFilter;

export type TableFilter = {
  options: { label: string; value: string; isSelected?: boolean }[];
  isMulti?: boolean;
  isDisabled?: boolean;
  disablesField?: {
    label: TableFilterLabel;
    message?: string;
  };
  disabledTooltip?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  isSelected?: boolean;
  /** Use to override aspects of the list for a filter */
  components?: Record<string, FC<any> | VFC<any>>;
  asyncSearch?: (input: string) => Promise<TableFilter['options']>;
  asyncHydrate?: () => Promise<TableFilter['options']>;
  noOptionsMessage?: string;
  hydrated?: boolean;
};

/** Label-Settings structure. */
export type TableFilters = Record<TableFilterLabel, TableFilter>;

export type ExtractedFilterSelections = Record<
  TableFilterLabel,
  Record<string, boolean>
>;
