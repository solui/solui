import get from 'lodash.get'
import each from 'lodash.foreach'
import isEmpty from 'lodash.isempty'

export const _ = { get, each, isEmpty }

export const promiseSerial = (items, asyncFn) => (
  Object.keys(items).reduce((m, k) => m.then(() => asyncFn(k, items[k])), Promise.resolve())
)

export const createErrorWithDetails = (msg, details) => {
  const e = new Error(msg)
  e.details = details
  return e
}
