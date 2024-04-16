import { PUBSUB_NAMES } from 'src/graphql/pubsub.helpers';
import getRedisClient from './getRedisClient';

export const publisher = getRedisClient(PUBSUB_NAMES.publisher);
export const subscriber = getRedisClient(PUBSUB_NAMES.subscriber);
