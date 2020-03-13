/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'

import { _, toDecimalVal, deriveDecimalVal } from '@solui/utils'

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
  const tips = []

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

  if (validations.length) {
    tips.push([ <p><em>Rules:</em></p> ])

    validations.forEach(({ type: vType, ...vConfig }) => {
      switch (vType) {
        case 'length':
          tips.push([ `Length:`, `${vConfig.min ? `≥${vConfig.min} ` : ''}${vConfig.max ? `≤${vConfig.max}` : ''}` ])
          break
        case 'range':
          tips.push([`Range:`, `${vConfig.min ? `≥${vConfig.min} ` : ''}${vConfig.max ? `≤${vConfig.max}` : ''}`])
          break
        case 'allowedTypes':
          const aT = [ vConfig.contract ? 'Contract' : '', vConfig.eoa ? 'Externally-owned account' : '' ]
          tips.push([`Allowed types:`, aT.filter(v => !!v).join(', ')])
          break
        case 'matchesBytecode':
          tips.push([`Must be contract:`, vConfig.contract])
          break
        case 'compareToField':
          switch (vConfig.operation) {
            case 'notEqual':
              tips.push([`Must match field:`, vConfig.field])
              break
          }
          break
      }
    })
  }

  return {
    metaText,
    tooltip: (
      <ul>
        <li>Type: <strong>{type}</strong></li>
        {tips.map(t => (
          <li key={t[0]}>{t[0]} <strong>{t[1]}</strong></li>
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
