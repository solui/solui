import { _ } from '@solui/utils'

[
  'LOGIN',
].forEach(v => {
  exports[v] = _.camelCase(v.toLowerCase())
})
