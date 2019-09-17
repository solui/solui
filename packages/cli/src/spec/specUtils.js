import { _, assertEthAddressIsValid } from '@solui/utils'


export const isValidId = id => (!(/[^A-Za-z0-9-]/gm.exec(id)))

export const extractChildById = (array, needle) => (array || []).find(({ id }) => id === needle)

export const inputIsPresent = (ctx, key) => (
  Object.keys(ctx.inputs() || {}).includes(key)
)

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

export const checkImageIsValid = (ctx, img) => {
  if (!_.get(img, 'url') || typeof img.url !== 'string') {
    ctx.errors().add(ctx.id, 'image must be valid')
  }
}

export const checkAddressIsValid = async (ctx, value, allowedTypes) => {
  try {
    if (allowedTypes && !Array.isArray(allowedTypes)) {
      throw new Error(`allowedTypes must be an array`)
    }

    assertEthAddressIsValid(value, ctx.web3, {
      allowContract: allowedTypes.incudes('contract'),
      allowEoa: allowedTypes.includes('eoa')
    })
  } catch (err) {
    ctx.errors().add(ctx.id, err.message)
  }
}
