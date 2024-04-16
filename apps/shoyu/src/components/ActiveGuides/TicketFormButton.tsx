import React, { useCallback } from 'react';
import cx from 'classnames';
import { ActiveGuidesCard, ActiveGuidesCardTitle } from './commonComponents';
import BugIcon from '../../icons/bug.svg';

type Props = {
  isSidebar: boolean;
  primaryColorHex: string;
  fontColorHex: string;
  onClick: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

export default function TicketFormButton({
  isSidebar,
  primaryColorHex,
  fontColorHex,
  onClick,
  ...props
}: Props) {
  const handleZendeskTicketClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onClick();
    },
    [onClick]
  );

  return (
    <div {...props}>
      <a onClick={handleZendeskTicketClick} target="_blank" className="block">
        <ActiveGuidesCard
          className={cx('align-center', 'gap-2', 'justify-stretch', {
            'p-4 gap-2': !isSidebar,
            'gap-3': isSidebar,
            'bento-link-inline-wrapper': !isSidebar,
            'bento-link-sidebar-wrapper': isSidebar,
          })}
          withBorder={!isSidebar}
        >
          <div
            className={cx(
              'flex items-center justify-center rounded-full overflow-hidden',
              {
                'w-10 h-10': !isSidebar,
                'w-8 h-8': isSidebar,
              }
            )}
          >
            <BugIcon
              style={{
                width: '60%',
                color: primaryColorHex,
              }}
            />
          </div>

          <ActiveGuidesCardTitle
            style={isSidebar ? { color: fontColorHex } : undefined}
            className="bento-link-title"
          >
            Report an issue
          </ActiveGuidesCardTitle>
        </ActiveGuidesCard>
      </a>
    </div>
  );
}
