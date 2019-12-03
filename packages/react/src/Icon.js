/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'

import { config, library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faInfo,
  faLaughSquint,
  faExclamation,
  faCopy,
  faNetworkWired,
  faLink,
} from '@fortawesome/free-solid-svg-icons'

config.autoAddCss = false

library.add(
  faInfo,
  faNetworkWired,
  faLaughSquint,
  faExclamation,
  faCopy,
  faLink,
)

const MAP = {
  fas: [
    'info',
    'laugh-squint',
    'exclamation',
    'network-wired',
    'copy',
    'link',
  ],
}

const getCategory = name => Object.keys(MAP).find(c => MAP[c].includes(name))

/**
 * Render an icon.
 *
 * To use this component without [on-screen icon flickering](https://github.com/FortAwesome/react-fontawesome/issues/134#issuecomment-471940596)
 * the following line should be added to your React app's root file, before
 * anything gets rendered:
 *
 * ```js
 * require('@fortawesome/fontawesome-svg-core/styles.css')
 * ```
 *
 * @return {ReactElement}
 */
const Icon = ({ className, name, ...props }) => (
  <FontAwesomeIcon className={className} icon={[ getCategory(name), name ]} {...props} />
)

export default Icon
