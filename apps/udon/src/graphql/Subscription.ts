import { GraphQLObjectType } from 'graphql';

import guideChanged from 'src/graphql/Guide/subscriptions/guideChanged';
import guideBaseChanged from 'src/graphql/GuideBase/subscriptions/guideBaseChanged';
import inlineEmbedsChanged from './InlineEmbed/subscriptions/inlineEmbedsChanged';
import onboardingInlineEmbedsChanged from './InlineEmbed/subscriptions/onboardingInlineEmbedsChanged';
import templateInlineEmbedChanged from './Template/subscriptions/templateInlineEmbedChanged';
import organizationChanged from './Organization/subscriptions/organizationChanged.subscription';
import { GraphQLContext } from './types';

const Subscription = new GraphQLObjectType<any, GraphQLContext>({
  name: 'Subscription',
  fields: {
    guideBaseChanged,
    guideChanged,
    inlineEmbedsChanged,
    onboardingInlineEmbedsChanged,
    templateInlineEmbedChanged,
    organizationChanged,
  },
});

export default Subscription;
