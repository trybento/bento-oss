import React, { useCallback, useEffect, useState } from 'react';
import composeComponent from 'bento-common/hocs/composeComponent';
import withCustomUIContext from '../../hocs/withCustomUIContext';
import withFormFactor from '../../hocs/withFormFactor';
import withSidebarContext from '../../hocs/withSidebarContext';
import LinkIcon from '../../icons/comment.svg';
import { hasZendeskChat, openZendesk } from '../../lib/zendesk';
import { CustomUIProviderValue } from '../../providers/CustomUIProvider';
import { FormFactorContextValue } from '../../providers/FormFactorProvider';
import { SidebarProviderValue } from '../../providers/SidebarProvider';
import sidebarStore from '../../stores/sidebarStore';

type OuterProps = {};

type Props = OuterProps &
  Pick<SidebarProviderValue, 'setIsSidebarExpanded' | 'isSidebarExpanded'> &
  Pick<CustomUIProviderValue, 'helpCenterStyle'> &
  Pick<FormFactorContextValue, 'isPreviewFormFactor'>;

const ZendeskChat: React.FC<Props> = ({
  setIsSidebarExpanded,
  isSidebarExpanded,
  helpCenterStyle,
  isPreviewFormFactor,
}: Props) => {
  const [zdEnabled, setZdEnabled] = useState(false);

  useEffect(() => {
    setZdEnabled(hasZendeskChat(isPreviewFormFactor));
  }, [isPreviewFormFactor]);

  const handleOpenZendesk = useCallback(() => {
    openZendesk();
    if (isSidebarExpanded) void setIsSidebarExpanded(false);
    sidebarStore.getState().setHiddenViaZendesk(true);
  }, [isSidebarExpanded, setIsSidebarExpanded]);

  if (!zdEnabled) return null;

  return (
    <div
      className="text-sm cursor-pointer flex gap-2.5 items-center select-none"
      onClick={handleOpenZendesk}
    >
      <LinkIcon
        className="text-gray-600 resource-center-icon-w"
        style={{ transform: 'scaleX(-1)' }}
      />
      <div>{helpCenterStyle.chatTitle}</div>
    </div>
  );
};

export default composeComponent<OuterProps>([
  withSidebarContext,
  withCustomUIContext,
  withFormFactor,
])(ZendeskChat);
