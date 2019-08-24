import { _ } from '../utils'

export const inputIsPresent = (ctx, key) => (
  Object.keys(_.get(ctx, 'inputs', {})).includes(key)
)

export const getAbi = (ctx, contractId) => {
  const { abi } = ctx.artifacts[contractId]
  return abi
}

export const getBytecode = (ctx, contractId) => {
  const { bytecode } = ctx.artifacts[contractId]
  return bytecode
}

export const getMethod = (ctx, contractId, methodName) => {
  const { abi } = ctx.artifacts[contractId]
  return abi.find(def => (
    'constructor' === methodName
      ? (def.type === 'constructor')
      : (def.name === methodName && def.type === 'function')
  ))
}
