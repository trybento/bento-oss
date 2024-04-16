import { RedisPubSub } from 'graphql-redis-subscriptions';
import { getRedisClient } from 'src/utils/redis';
import { PUBSUB_NAMES } from './pubsub.helpers';

const pubsub = new RedisPubSub({
  publisher: getRedisClient(PUBSUB_NAMES.publisher),
  subscriber: getRedisClient(PUBSUB_NAMES.subscriber),
});

export const closePubSub = () => pubsub.close();

export default pubsub;
