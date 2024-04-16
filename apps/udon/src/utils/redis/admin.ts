import getRedisClient from './getRedisClient';
import { PUBSUB_NAMES } from 'src/graphql/pubsub.helpers';

export const publisher = getRedisClient(PUBSUB_NAMES.publisher);
export const subscriber = getRedisClient(PUBSUB_NAMES.subscriber);
