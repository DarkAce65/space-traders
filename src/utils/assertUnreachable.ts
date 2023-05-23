const assertUnreachable = (value: never): never => {
  console.error('Unreachable', value);
  throw new Error('Unreachable');
};

export default assertUnreachable;
