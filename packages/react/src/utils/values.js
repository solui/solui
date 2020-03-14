/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'

import { _, toDecimalVal, deriveDecimalVal } from '@solui/utils'

export const isArrayFieldType = type => type.endsWith('[]')

/**
 * Get meta string to display to user based on input's value and configuration.
 *
 * @param  {String} type             Input type
 * @param  {*} value            Input current value
 * @param  {Object} config  Input configuration
 *
 * @return {InputMeta}
 */
export const getMetaTextForInput = ({ type, value, config }) => {
  const tips = [
    [ 'Type:', <code>{type}</code>]
  ]

  let metaText

  switch (type) {
    case 'int': {
      const unit = _.get(config, 'unit')
      const scale = _.get(config, 'scale')

      if (unit) {
        tips.push([ `Unit:`, unit ])
      }

      if (scale) {
        const realVal = deriveDecimalVal(value, { scale })
        metaText = `Final value: ${realVal ? realVal.toString(10) : ''}`
      }

      break
    }
    default:
      // do nothing
  }

  const validations = _.get(config, 'validation', [])

  const valueTips = []

  if (validations.length) {
    validations.forEach(({ type: vType, ...vConfig }) => {
      switch (vType) {
        case 'length':
          valueTips.push([
            `Length:`,
            <code>{`${vConfig.min ? `≥${vConfig.min} ` : ''}${vConfig.max ? `≤${vConfig.max}` : ''}`}</code>
          ])
          break
        case 'range':
          valueTips.push([
            `Range:`,
            <code>{`${vConfig.min ? `≥${vConfig.min} ` : ''}${vConfig.max ? `≤${vConfig.max}` : ''}`}</code>
          ])
          break
        case 'allowedTypes':
          const aT = [ vConfig.contract ? 'Contract' : '', vConfig.eoa ? 'Externally-owned account' : '' ]
          valueTips.push([`Allowed types:`, aT.filter(v => !!v).join(', ')])
          break
        case 'matchesBytecode':
          valueTips.push([`Bytecode matches:`, vConfig.contract])
          break
        case 'compareToField':
          switch (vConfig.operation) {
            case 'notEqual':
              valueTips.push([`Does not match field:`, vConfig.field])
              break
          }
          break
      }
    })
  }

  let valueTipsHeading = 'Rules:'

  if (isArrayFieldType(type)) {
    valueTipsHeading = 'List item rules:'

    const listTips = []

    validations.forEach(({ type: vType, ...vConfig }) => {
      switch (vType) {
        case 'arrayLength':
          listTips.push([
            `Length:`,
            <code>{`${vConfig.min ? `≥${vConfig.min} ` : ''}${vConfig.max ? `≤${vConfig.max}` : ''}`}</code>
          ])
          break
      }
    })

    if (listTips.length) {
      tips.push(<p><em>List rules:</em></p>)
      tips.push(...listTips)
    }

    tips.push(<p><em>List format:</em></p>)
    tips.push('Please enter comma-separated values!')
  }

  if (valueTips.length) {
    tips.push(<p><em>{valueTipsHeading}</em></p>)
    tips.push(...valueTips)
  }

  return {
    metaText,
    tooltip: (
      <ul>
        {tips.map((t, i) => (
          <li key={i}>{Array.isArray(t) ? <span>{t[0]} <strong>{t[1]}</strong></span> : t}</li>
        ))}
      </ul>
    )
  }
}


/**
 * Get renderable values for given output value and config.
 *
 * @param  {String} type             Output type
 * @param  {*} value            Output current value
 * @param  {Object} config  Output configuration
 *
 * @return [String]
 */
export const getRenderableValuesForOutput = ({ type, value, config }) => {
  // if value is a big number then convert to a base-10 string
  if (value && value._hex) {
    value = toDecimalVal(value).toString(10)
  }

  switch (type) {
    case 'bool': {
      return [ value ? 'TRUE' : 'FALSE' ]
    }
    case 'int': {
      const v = []

      const unit = _.get(config, 'unit')
      const scale = _.get(config, 'scale')

      if (scale) {
        const realNum = deriveDecimalVal(value, config)
        v.push(`${realNum}${unit ? ` ${unit}` : ''}`)
      }

      v.push(value)

      return v
    }
    default:
      return [ value ]
  }
}


/**
 * @typedef {Object} InputMeta
 * @property {String} metaText User-friendly help display string.
 * @property {ReactElement} tooltip Tooltip to show user.
 */
