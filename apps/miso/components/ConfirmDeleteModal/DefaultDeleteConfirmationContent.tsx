import React from 'react';
import { EmojiList, EmojiListItem } from 'bento-common/components/EmojiList';

export default function DefaultDeleteConfirmationContent(): JSX.Element {
  return (
    <EmojiList>
      <EmojiListItem emoji="📊">
        This will also remove any related analytics
      </EmojiListItem>
    </EmojiList>
  );
}
