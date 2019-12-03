// 13inch macbook pro: 1280 x 627
// 15inch macbook pro:  1125 x 892

const breakpoints = {
  width: {
    mobile: '950px',
    desktop: '1280px',
  },
  height: {
    tall: '800px',
  }
}

const getSize = (bp, type) => {
  const size = Object.keys(breakpoints[type]).find(k => k === bp)

  if (!size) {
    throw new Error(`Invalid ${type} breakpoint: ${bp}`)
  }

  return breakpoints[type][size]
}

/**
 * Responsive layout utilities
 * @type {Object}
 */
export const media = {
  /**
   * Maximum content width as a CSS dimension.
   *
   * @type {String}
   * @name media.maxWidth
   */
  maxWidth: breakpoints.width.desktop,
  /**
   * Generate media query.
   * @param  {Object} m Parameters
   * @return {String}
   * @name media.when
   */
  when: m => {
    const vals = Object.entries(m).map(([ k, v ]) => {
      let type

      if (k.endsWith('W')) {
        type = 'width'
      } else if (k.endsWith('H')) {
        type = 'height'
      } else {
        throw new Error(`Bad suffix: ${k}`)
      }

      return `${k.substr(0, 3)}-${type}: ${getSize(v, type)}`
    })

    return `@media (${vals.join(') and (')})`
  },
}
