const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const picked: Partial<T> = {};
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      picked[key] = obj[key];
    }
  }

  return picked as Pick<T, K>;
};

export default pick;
