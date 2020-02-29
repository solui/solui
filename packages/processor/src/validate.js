import {
  _,
  assertEthAddressIsValidOnChain,
  getBytecode,
  toDecimalVal,
  deriveDecimalVal,
  hash,
} from '@solui/utils'

import { getDeployedBytecode } from './utils'

export const checkIdIsValid = (ctx, id) => {
  if (!id) {
    ctx.errors().add(ctx.id, 'id must be set')
    return
  }

  if (id.length < 3 || id.length > 32) {
    ctx.errors().add(ctx.id, 'id must be between 3 and 32 characters in length')
  }

  if (/[^A-Za-z0-9-]/g.exec(id)) {
    ctx.errors().add(ctx.id, 'id must only contain alphanumeric characters and hyphen (-)')
  }
}

export const checkVersionIsValid = (ctx, version) => {
  if (1 !== version) {
    ctx.errors().add(ctx.id, 'version must be 1')
  }
}

export const checkTitleIsValid = (ctx, title) => {
  if (!title) {
    ctx.errors().add(ctx.id, 'title must be set')
    return
  }

  if (3 > title.length || 256 < title.length) {
    ctx.errors().add(ctx.id, 'title must be between 3 and 256 characters in length')
  }
}

export const checkImageIsValid = (ctx, img) => {
  if (!_.get(img, 'url') || typeof img.url !== 'string') {
    ctx.errors().add(ctx.id, 'image must be valid')
  }
}

export const checkAddressIsValid = async (ctx, value, { allowedTypes } = {}) => {
  try {
    await assertEthAddressIsValidOnChain(value, ctx.network().node, {
      allowContract: !!allowedTypes.contract,
      allowEoa: !!allowedTypes.eoa
    })
  } catch (err) {
    ctx.errors().add(ctx.id, err.message)
  }
}

export const checkAddressIsContractWithBytecode = async (ctx, value, { contract }) => {
  try {
    const bc = getDeployedBytecode(ctx, contract)

    if (!bc) {
      throw new Error(`bytecode not found for ${contract}`)
    }

    await assertEthAddressIsValidOnChain(value, ctx.network().node, {
      allowContract: true,
      allowEoa: false,
    })

    const ocbc = await getBytecode(ctx.network().node, value)

    if (hash(bc) !== hash(ocbc)) {
      throw new Error(`must have same bytecode as ${contract}`)
    }
  } catch (err) {
    ctx.errors().add(ctx.id, err.message)
  }
}

export const checkStringIsValid = async (ctx, value, { length } = {}) => {
  try {
    const minLen = parseInt(_.get(length, 'min'), 10)
    const maxLen = parseInt(_.get(length, 'max'), 10)

    const minLenValid = !Number.isNaN(minLen)
    const maxLenValid = !Number.isNaN(maxLen)

    if (!minLenValid && !maxLenValid) {
      throw new Error(`length config: either one of min and max must be numbers`)
    }

    if (minLenValid && 0 > minLen) {
      throw new Error(`length config: min must be greater than or equal to 0`)
    }

    if (maxLenValid && 0 > maxLen) {
      throw new Error(`length config: max must be greater than or equal to 0`)
    }

    if (minLenValid && maxLenValid && minLen > maxLen) {
      throw new Error(`length config: max must be greater than or equal to min`)
    }

    if (minLenValid && minLen > value.length) {
      throw new Error(`input must be atleast ${minLen} characters long`)
    }

    if (maxLenValid && maxLen < value.length) {
      throw new Error(`input must be no more than ${maxLen} characters long`)
    }
  } catch (err) {
    ctx.errors().add(ctx.id, err.message)
  }
}

export const checkNumberIsValid = async (
  ctx,
  value,
  { scale, range } = {},
) => {
  try {
    const val = deriveDecimalVal(value, { scale })

    if (!val) {
      throw new Error('invalid input')
    }
    const min = _.get(range, 'min')
    const max = _.get(range, 'max')

    const minVal = toDecimalVal(min, scale)
    const maxVal = toDecimalVal(max, scale)

    if (minVal && maxVal && minVal.gt(maxVal)) {
      throw new Error(`range config: max must be greater than or equal to min`)
    }

    if (minVal && minVal.gt(val)) {
      throw new Error(`input must be greater than or equal to ${min}`)
    }

    if (maxVal && maxVal.lt(val)) {
      throw new Error(`input must be less than or equal to ${max}`)
    }
  } catch (err) {
    ctx.errors().add(ctx.id, err.message)
  }
}

export const checkValueIsRelatedToOtherFieldValue = async (ctx, value, { field } = {}) => {
  const otherVal = ctx.inputs().get(field.field)

  if (typeof otherVal !== 'undefined') {
    try {
      switch (field.operation) {
        case 'notEqual':
          if (value === otherVal) {
            throw new Error(`must be different to ${field.field}`)
          }
          break
        default:
          throw new Error(`invalid operation in config: ${field.operation}`)
      }
    } catch (err) {
      ctx.errors().add(ctx.id, err.message)
    }
  }
}


export const validateInputValue = async (ctx, value, config) => {
  if (!_.get(config.validation, 'length')) {
    return
  }

  const promises = config.validation.map(({ type, ...vConfig }) => {
    switch (type) {
      case 'allowedTypes':
        return checkAddressIsValid(ctx, value, { allowedTypes: vConfig })
      case 'length':
        return checkStringIsValid(ctx, value, { length: vConfig })
      case 'range':
        return checkNumberIsValid(ctx, value, {
          scale: config.scale,
          range: vConfig,
        })
      case 'compareToField':
        return checkValueIsRelatedToOtherFieldValue(ctx, value, { field: vConfig })
      case 'matchesBytecode':
        return checkAddressIsContractWithBytecode(ctx, value, vConfig)
      default:
        return null
    }
  })

  await Promise.all(promises)
}
