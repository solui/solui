/**
 * Process each item in given array (using async callback) in serial mode.
 *
 * Like `Promise.all()` but processing serially instead of in parallel.
 *
 * @param  {Array} items   Items.
 * @param  {Function} asyncFn Async callback.
 * @return {Promise}
 */
export const promiseSerial = (items, asyncFn) => (
  Object.keys(items).reduce((m, k) => m.then(() => asyncFn(items[k], k)), Promise.resolve())
)
