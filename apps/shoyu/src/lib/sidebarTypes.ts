export type SidebarWrapperProps = {
  isOverlayDisplayed: boolean;
  handleDismissOverlay: () => void;
  emphasizeToggle: boolean;
  headerRef: HTMLDivElement | null | undefined;
  container?: HTMLElement | null;
};
