/** Break a CSV string into an array of objs */
const csvToArray = (
  csvString: string,
  delimiter = ',',
  maxParse?: number
): Array<Record<string, string>> => {
  const _csvString = csvString.replace(/\r/g, '');

  const headers = csvString.slice(0, _csvString.indexOf('\n')).split(delimiter);
  const rows = _csvString.slice(_csvString.indexOf('\n') + 1).split('\n');

  const _rows = maxParse && maxParse > 0 ? rows.slice(0, maxParse) : rows;

  /* Empty rows are still being iterated, make it stop */
  if (_rows.length === 1 && _rows[0] === '') return [];

  const result = _rows.map((row) => {
    const values = row.split(delimiter);
    return headers.reduce((object, header, index) => {
      object[header] = values[index]?.trim();
      return object;
    }, {} as Record<string, string>);
  });

  return result;
};

export default csvToArray;
