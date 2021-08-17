import {
  _,
  deriveDecimalVal,
  slugify,
} from '@solui/utils'

export const extractChildById = (array, needle) => (array || []).find(({ id }) => id === needle)

export const generateId = spec => {
  return slugify(spec.title)
}

const extractRefTypeNameAndSubPath = v => {
  const extractorRegex = new RegExp(`\\[(.+?)\\]`, 'gmi')

  const refType = [
    'input',
    'constant',
    'env'
  ].find(k => {
    const r = new RegExp(`@${k}\\[.+\\]`)
    return !!r.exec(v)
  })

  if (!refType) {
    return {}
  }

  const refPath = []
  let s
  do {
    s = _.get(extractorRegex.exec(v), '1')
    if (s) {
      refPath.push(s)
    }

    // only inputs and constants support nested values at the moment
    if ('input' !== refType && 'constant' !== refType) {
      break
    }
  } while (s)

  return { type: refType, name: refPath[0], subPath: refPath.slice(1) }
}

const getValAtPath = (v, pathArray) => {
  if (pathArray.length) {
    return _.get(v, pathArray.join('.'))
  } else {
    return v
  }
}

export const resolveValue = (ctx, val, { throwIfNotReference = false } = {}) => {
  val = val || ''

  const { type, name, subPath } = extractRefTypeNameAndSubPath(val)

  if ('input' === type) {
    if (!ctx.inputs().has(name)) {
      throw new Error(`input not found: ${name}`)
    }

    return getValAtPath(ctx.inputs().get(name), subPath)
  } else if ('constant' === type) {
    if (!ctx.constants().has(name)) {
      throw new Error(`constant not found: ${name}`)
    }

    const def = ctx.constants().get(name)

    // get value for network we're on or just return the default
    const { id = 'default' } = ctx.network()

    return getValAtPath(def[id] || def.default, subPath)
  } else if ('env' === type) {
    // only "account" is supported right now
    if (name !== 'account') {
      throw new Error(`invalid env var: ${name}`)
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

const _finalizeSingleInputValue = (ctx, value, config) => {
  const { type } = config

  switch (type) {
    case 'int':
      const fv = deriveDecimalVal(value, config)
      return (fv ? fv.toString(10) : fv)
    case 'bool':
      return ['true', '1'].includes(`${value}`.toLowerCase()) ? true : false
    default:
      return value
  }
}

export const finalizeInputValue = (ctx, value, config) => {
  const { type } = config

  if (isArrayFieldType(type)) {
    const scalarType = extractScalarTypeFromArrayFieldType(type)

    return value.map(v => _finalizeSingleInputValue(ctx, v, { ...config, type: scalarType }))
  } else {
    return _finalizeSingleInputValue(ctx, value, config)
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

export const getDeployedBytecode = (ctx, contractId) => {
  const { deployedBytecode } = ctx.artifacts()[contractId]
  return deployedBytecode
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
  if (progressCallback && tx) {
    progressCallback('tx', tx)
  }
}

export const reportExecutionSuccess = (progressCallback, msg) => {
  if (progressCallback && msg) {
    progressCallback('success', msg)
  }
}

export const reportExecutionFailure = (progressCallback, msg) => {
  if (progressCallback && msg) {
    progressCallback('failure', msg)
  }
}

export const isArrayFieldType = type => type.endsWith('[]')

export const extractScalarTypeFromArrayFieldType = type => type.endsWith('[]') ? type.substr(0, type.indexOf('[')) : type

