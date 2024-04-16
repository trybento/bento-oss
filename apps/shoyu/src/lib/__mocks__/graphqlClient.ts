export const getGraphqlInstance = () => ({
  executeQuery: jest.fn(),
  executeMutation: jest.fn(),
  executeSubscription: jest.fn(),
});

export const closeWsConnection = () => jest.fn();
