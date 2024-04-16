import { GraphQLObjectType } from 'graphql';

import availableGuidesChanged from 'src/graphql/embed/EmbedGuide/subscriptions/availableGuidesChanged.subscription';
import guideChanged from 'src/graphql/embed/EmbedGuide/subscriptions/guideChanged.subscription';
import stepAutoCompleteInteractionsChanged from 'src/graphql/embed/EmbedStepAutoCompleteInteraction/subscriptions/stepAutoCompleteInteractionsChanged.subscription';
import inlineEmbedsChanged from 'src/graphql/embed/EmbedInlineEmbeds/subscriptions/inlineEmbedsChanged.subscription';
import { EmbedContext } from '../types';

const Subscription = new GraphQLObjectType<any, EmbedContext>({
  name: 'Subscription',
  fields: {
    availableGuidesChanged,
    guideChanged,
    stepAutoCompleteInteractionsChanged,
    inlineEmbedsChanged: inlineEmbedsChanged,
    inlineEmbedsChangedNew: inlineEmbedsChanged,
  },
});

export default Subscription;
