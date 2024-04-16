import { UISettingsQuery } from 'relay-types/UISettingsQuery.graphql';
import { StylesTabLabels } from './styles.helpers';

enum GeneralSections {
  core = 'core',
  sidebar = 'sidebar',
  advanced = 'advanced',
}

enum GuideSections {
  guides = 'guides',
}

export type SectionName = GeneralSections | GuideSections;

export type NavigationOption = {
  title: string;
  anchor: string;
};

export type NavigationSection = {
  title: string;
  options: NavigationOption[];
};

export type NavigationItems<T extends SectionName> = Record<
  T,
  NavigationSection
>;

export type UISettingsProps = UISettingsQuery['response'] & {
  onRefetch?: () => void;
};

export const customCssTitle = 'Custom CSS';

export const getNavSettingId = (anchor: string) => `settings-nav-${anchor}`;

const GUIDES_NAV_ITEMS: NavigationItems<GuideSections> = {
  [GuideSections.guides]: {
    title: 'Guide styles',
    options: [
      { title: 'Checklists', anchor: 'checklists' },
      {
        title: 'Tooltips',
        anchor: 'tooltips',
      },
      {
        title: 'Cards',
        anchor: 'embedded_empty_states',
      },
      {
        title: 'Announcements',
        anchor: 'announcements',
      },
    ],
  },
};

export enum StyleAnchors {
  colors = 'colors',
  fontSizes = 'fonts',
  buttons = 'button',
  visualTags = 'tags',
  sidebarStyle = 'sidebar_style',
  headerStyle = 'header_style',
  toggleStyle = 'toggle',
  toggleVisibility = 'toggle_visibility',
  sidebarVisibility = 'sidebar_visibility',
  mobileAppearance = 'mobile_appearance',
  customCss = 'custom_css',
}

const GENERAL_NAV_ITEMS: NavigationItems<GeneralSections> = {
  [GeneralSections.core]: {
    title: 'Core styles',
    options: [
      { title: 'Colors', anchor: StyleAnchors.colors },
      { title: 'Font sizes', anchor: StyleAnchors.fontSizes },
      { title: 'Buttons', anchor: StyleAnchors.buttons },
      { title: 'Visual tags', anchor: StyleAnchors.visualTags },
    ],
  },
  [GeneralSections.sidebar]: {
    title: 'Sidebar',
    options: [
      { title: 'Style', anchor: StyleAnchors.sidebarStyle },
      { title: 'Header', anchor: StyleAnchors.headerStyle },
      { title: 'Toggle style', anchor: StyleAnchors.toggleStyle },
      { title: 'Toggle visibility', anchor: StyleAnchors.toggleVisibility },
      { title: 'Sidebar visibility', anchor: StyleAnchors.sidebarVisibility },
    ],
  },
  [GeneralSections.advanced]: {
    title: 'Advanced',
    options: [
      { title: 'Mobile appearance', anchor: StyleAnchors.mobileAppearance },
      { title: customCssTitle, anchor: StyleAnchors.customCss },
    ],
  },
};

export const NAV_ITEMS = {
  [StylesTabLabels.general]: GENERAL_NAV_ITEMS,
  [StylesTabLabels.guideSpecific]: GUIDES_NAV_ITEMS,
};
