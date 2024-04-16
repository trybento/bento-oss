import EventEmitter from 'events';

export const redisReadyListener = new EventEmitter();

export enum PUBSUB_NAMES {
  publisher = 'publisher-graphql',
  subscriber = 'subscriber-graphql',
}

const readyStates = {
  [PUBSUB_NAMES.publisher]: false,
  [PUBSUB_NAMES.subscriber]: false,
};

const allReady = () => Object.values(readyStates).every((s) => s);

const safetyFallback = setTimeout(() => {
  if (!allReady()) redisReadyListener.emit('allReady');
}, 5 * 60 * 1000);

redisReadyListener.on('ready', (connectionName) => {
  if (connectionName in readyStates) readyStates[connectionName] = true;

  if (allReady()) {
    redisReadyListener.emit('allReady');
    if (safetyFallback) clearTimeout(safetyFallback);
  }
});

redisReadyListener.on('close', (connectionName) => {
  if (connectionName in readyStates) readyStates[connectionName] = false;

  redisReadyListener.emit('notReady');
});
