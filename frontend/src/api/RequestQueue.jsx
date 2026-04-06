// api/RequestQueue.js
let lastPromise = Promise.resolve();

export const enqueueRequest = (requestFn) => {
  // Chain new request to the previous one
  lastPromise = lastPromise
    .catch(() => {}) // ignore errors from previous
    .then(() => requestFn());
  return lastPromise;
};
