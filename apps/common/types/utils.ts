export type WithTypename<T, V extends string> = T & {
  __typename: V;
};
