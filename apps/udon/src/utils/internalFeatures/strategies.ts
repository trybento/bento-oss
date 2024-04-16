const randomGenerator = () => Math.floor(Math.random() * 100) + 1;

export const percentage = (options: { percentage: number }) => {
  return randomGenerator() <= options.percentage;
};

export const rateDict = (q: string, dict: Record<string, number>) => {
  const matchingKey = Object.keys(dict).find((key) => q.includes(key));
  const rate = matchingKey ? dict[matchingKey] : 0;

  return randomGenerator() <= rate;
};

export type StringMatchArgs = {
  ffName: string;
  key: string;
  value: string;
  payload?: object;
};
