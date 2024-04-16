import React from 'react';
import cx from 'classnames';
import { QuickLinks as QuickLinksType } from 'bento-common/types';
import { ActiveGuidesCard, ActiveGuidesCardTitle } from './commonComponents';
import LinkIcon from '../../icons/link.svg';

type Props = {
  quickLinks?: QuickLinksType;
  isSidebar: boolean;
  primaryColorHex: string;
  fontColorHex: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function QuickLinks({
  quickLinks,
  isSidebar,
  primaryColorHex,
  fontColorHex,
  ...props
}: Props) {
  return quickLinks?.length ? (
    <div {...props}>
      {quickLinks.map((link) => (
        <a key={link.url} href={link.url} target="_blank" className="block">
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
              {link.icon ? (
                <img
                  src={link.icon}
                  className="w-full h-full max-h-full max-w-full"
                />
              ) : (
                <LinkIcon
                  style={{
                    width: '60%',
                    color: primaryColorHex,
                  }}
                />
              )}
            </div>

            <ActiveGuidesCardTitle
              style={isSidebar ? { color: fontColorHex } : undefined}
              className="bento-link-title"
            >
              {link.title}
            </ActiveGuidesCardTitle>
          </ActiveGuidesCard>
        </a>
      ))}
    </div>
  ) : null;
}
