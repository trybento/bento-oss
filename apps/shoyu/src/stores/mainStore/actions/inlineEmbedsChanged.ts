import { normalize, NormalizedSchema } from 'normalizr';
import {
  GlobalStateActionPayloads,
  InlineEmbed,
  InlineEmbedEntityId,
} from 'bento-common/types/globalShoyuState';

import schema from '../schema';
import { WorkingState } from '../types';

// TODO: Has to be a better way to specify these types
type NormalizedData = NormalizedSchema<
  { inlineEmbeds: Record<InlineEmbedEntityId, InlineEmbed> },
  InlineEmbedEntityId[]
>;

export default function inlineEmbedsChanged(
  state: WorkingState,
  payload: GlobalStateActionPayloads['inlineEmbedsChanged']
) {
  const previewInlineEmbeds = Object.values<InlineEmbed>(
    state.inlineEmbeds
  ).filter((embed) => embed.previewId);
  const {
    result: _inlineEmbedEntityIds,
    entities: { inlineEmbeds },
  } = normalize(payload.inlineEmbeds.concat(previewInlineEmbeds), [
    schema.inlineEmbed,
  ]) as NormalizedData;

  state.inlineEmbeds = inlineEmbeds || {};
}
