/** Return partial version of an object with only specified keys */
export function slice<T>(input: T, keys: string[]) {
  if (!input) {
    return input;
  }
  const ret = {};
  for (const k of keys) {
    const path = k.split('.');
    if (path.length === 1) {
      ret[k] = input[k];
    } else {
      path.reverse();
      let inp = input;
      let node = ret;
      while (path.length > 1) {
        const key = path.pop()!;
        if (node[key] === undefined) {
          node[key] = {};
        }
        inp = inp[key];
        node = node[key];
      }
      node[path[0]] = inp[path[0]];
    }
  }
  return ret;
}
