import { InlineEmbed } from 'bento-common/types/globalShoyuState';

import { WorkingState } from '../types';

export default function inlineEmbedSet(
  state: WorkingState,
  payload: { inlineEmbed: InlineEmbed }
) {
  state.inlineEmbeds[payload.inlineEmbed.entityId] = payload.inlineEmbed;
}
