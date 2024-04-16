export function findMap<V, M>(
  arr: V[],
  mapper: (item: V) => M,
  predicate: (item: M) => boolean
): M | undefined {
  for (const elem of arr) {
    const result = mapper(elem);
    if (predicate(result)) {
      return result;
    }
  }
}
