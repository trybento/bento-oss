import { Event } from 'src/data/models/Analytics/Event.model';
import detachPromise from 'src/utils/detachPromise';
import { Events } from 'bento-common/types';

type Args = {
  eventName: Events;
  organizationEntityId: string;
  data: Record<string, any>;
};

/**
 * Created to prevent needing to import the Event model
 *   which overlaps with reserved keywords
 *
 * Intended for a one off event that doesn't fall cleanly into users/guides existing categories
 * untyped helper to analytics.newEvent
 */
export default function trackOneOffEvent(event: Args) {
  detachPromise(() => Event.create(event), 'track one-off event');
}

export { Events } from 'bento-common/types';
