export function looseInterleave(...arrs: any[]) {
  const maxLength = Math.max(...arrs.map((x) => x.length));

  const result = [];

  for (let i = 0; i < maxLength; ++i) {
    arrs.forEach(function (arr: any[]) {
      if (arr.length > i) {
        result.push(arr[i]);
      }
    });
  }

  return result;
}
