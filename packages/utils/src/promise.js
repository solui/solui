export const promiseSerial = (items, asyncFn) => (
  Object.keys(items).reduce((m, k) => m.then(() => asyncFn(items[k], k)), Promise.resolve())
)
