import { compose } from 'rambda'
import camelCase from 'lodash.camelcase'
import each from 'lodash.foreach'
import get from 'lodash.get'
import isEmpty from 'lodash.isempty'
import mapKeys from 'lodash.mapkeys'
import mapValues from 'lodash.mapvalues'
import pick from 'lodash.pick'
import snakeCase from 'lodash.snakecase'
import trimStr from 'lodash.trim'
import truncate from 'lodash.truncate'

/**
 * [Lodash](https://lodash.com) utility belt, with additional methods from [rambda](https://www.npmjs.com/package/rambda).
 *
 * @example
 *
 * import { _ } from '@solui/utils'
 * console.log( _.get(window, 'navigator') )
 *
 * @type {Object}
 */
export const _ = {
  camelCase,
  compose,
  each,
  get,
  isEmpty,
  mapKeys,
  mapValues,
  pick,
  snakeCase,
  trimStr,
  truncate,
}
