import {
  _,
  assertEthAddressIsValidOnChain,
  toEthVal,
} from '@solui/utils'

import { deriveRealNumber } from './utils'

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
    await assertEthAddressIsValidOnChain(value, ctx.node(), {
      allowContract: !!allowedTypes.contract,
      allowEoa: !!allowedTypes.eoa
    })
  } catch (err) {
    ctx.errors().add(ctx.id, err.message)
  }
}

export const checkStringIsValid = async (ctx, value, { length } = {}) => {
  try {
    const minLen = parseInt(_.get(length, 'min'), 10)
    const maxLen = parseInt(_.get(length, 'max'), 10)

    if (Number.isNaN(minLen) || Number.isNaN(maxLen)) {
      throw new Error(`length config: min and max must be numbers`)
    }

    if (0 > minLen || 0 > maxLen) {
      throw new Error(`length config: min and max must be greater than or equal to 0`)
    }

    if (minLen > maxLen) {
      throw new Error(`length config: max must be greater than or equal to min`)
    }

    if (minLen > value.length || maxLen < value.length) {
      throw new Error(`input must be between ${minLen} and ${maxLen} characters long`)
    }
  } catch (err) {
    ctx.errors().add(ctx.id, err.message)
  }
}

export const checkNumberIsValid = async (
  ctx,
  value,
  { unit, unsigned, range } = {},
) => {
  try {
    const val = deriveRealNumber(ctx, value, { unit })

    if (!val) {
      throw new Error('invalid input')
    }

    const minVal = toEthVal(_.get(range, 'min'), unit)

    if (!minVal) {
      throw new Error('range config: invalid min value')
    }

    const maxVal = toEthVal(_.get(range, 'max'), unit)

    if (!maxVal) {
      throw new Error('range config: invalid max value')
    }

    if (unsigned && (minVal.lt(0) || maxVal.lt(0))) {
      throw new Error(`range config: min and max must be greater than or equal to 0`)
    }

    if (minVal.gt(maxVal)) {
      throw new Error(`range config: max must be greater than or equal to min`)
    }

    if (minVal.gt(val) || maxVal.lt(val)) {
      throw new Error(`input must be between ${minVal.toString(10)} and ${maxVal.toString(10)}`)
    }
  } catch (err) {
    ctx.errors().add(ctx.id, err.message)
  }
}

export const checkValueIsRelatedToOtherFieldValue = async (ctx, value, { field } = {}) => {
  const otherVal = ctx.inputs()[field.field]

  if (otherVal) {
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
          unit: config.unit,
          unsigned: config.unsigned,
          range: vConfig,
        })
      case 'compareToField':
        return checkValueIsRelatedToOtherFieldValue(ctx, value, { field: vConfig })
      default:
        return null
    }
  })

  await Promise.all(promises)
}
