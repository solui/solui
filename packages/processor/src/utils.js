import { _, toEthVal } from '@solui/utils'

export const extractChildById = (array, needle) => (array || []).find(({ id }) => id === needle)

export const inputIsPresent = (ctx, key) => (
  Object.keys(ctx.inputs() || {}).includes(key)
)

export const resolveValue = (ctx, val) => {
  const inputName = _.get(val.match(/@input\[(.+)\]/), '1')

  if (inputName) {
    if (!inputIsPresent(ctx, inputName)) {
      throw new Error(`input not found: ${inputName}`)
    }

    return ctx.inputs()[inputName]
  } else {
    throw new Error(`invalid reference: ${inputName}`)
  }
}

export const methodArgExists = (methodAbi, argId) => (
  !!methodAbi.inputs.find(({ name }) => name === argId)
)

export const getAbi = (ctx, contractId) => {
  const { abi } = ctx.artifacts()[contractId]
  return abi
}

export const getBytecode = (ctx, contractId) => {
  const { bytecode } = ctx.artifacts()[contractId]
  return bytecode
}

export const getMethod = (ctx, contractId, methodName) => {
  const { abi } = ctx.artifacts()[contractId]
  return abi.find(def => (
    'constructor' === methodName
      ? (def.type === 'constructor')
      : (def.name === methodName && def.type === 'function')
  ))
}

export const deriveRealNumber = (
  ctx,
  value,
  { unit } = {},
) => {
  return toEthVal(value, unit)
}
