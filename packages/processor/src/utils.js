import { _, getAccount } from '@solui/utils'

export const extractChildById = (array, needle) => (array || []).find(({ id }) => id === needle)

export const resolveValue = (ctx, val, { throwIfNotReference = false } = {}) => {
  val = val || ''

  const inputName = _.get(val.match(/@input\[(.+)\]/), '1')
  const constantName = _.get(val.match(/@constant\[(.+)\]/), '1')
  const envName = _.get(val.match(/@env\[(.+)\]/), '1')

  if (inputName) {
    if (!ctx.inputs().has(inputName)) {
      throw new Error(`input not found: ${inputName}`)
    }

    return ctx.inputs().get(inputName)
  } else if (constantName) {
    if (!ctx.constants().has(constantName)) {
      throw new Error(`constant not found: ${constantName}`)
    }

    const def = ctx.constants().get(constantName)

    // get value for network we're on or just return the default
    const { id = 'default' } = ctx.network()

    return def[id]
  } else if (envName) {
    // only "account" is supported right now
    if (envName !== 'account') {
      throw new Error(`invalid env var: ${envName}`)
    }

    const { account = '' } = ctx.network()

    return account
  } else {
    if (throwIfNotReference) {
      throw new Error(`invalid reference: ${val}`)
    } else {
      return val
    }
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

export const reportTransactionProgress = (progressCallback, tx) => {
  if (progressCallback) {
    progressCallback('tx', tx)
  }
}