export default function promiseMiddleware() {
  return next => action => {
    const { promise, type, ...rest } = action;
    if (!promise) {
      return next(action);
    }

    const SUCCESS = type;
    const REQUEST = `${type}_REQUEST`;
    const FAILURE = `${type}_FAILURE`;

    next({...rest, type : REQUEST});

    try {
      return promise
        .then(res => next({...rest, result : res, type : SUCCESS}))
        .catch(err => {
          /* eslint-disable no-console */
          console.error('Failed promise', FAILURE, err);
          /* eslint-enable no-console */
          next({...rest, error : err, type : FAILURE});
        });
    } catch (err) {
      /* eslint-disable no-console */
      console.warn('error;', err);
      /* eslint-enable no-console */
      throw new Error('invalid promise given');
    }
  };
}
