/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'

import { config, library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faInfo,
  faLaughSquint,
  faExclamation,
  faCopy,
  faLink,
} from '@fortawesome/free-solid-svg-icons'

config.autoAddCss = false

library.add(
  faInfo,
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
    'copy',
    'link',
  ],
}

const getCategory = name => Object.keys(MAP).find(c => MAP[c].includes(name))

export default ({ className, name, ...props }) => (
  <FontAwesomeIcon className={className} icon={[ getCategory(name), name ]} {...props} />
)
