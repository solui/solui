/* eslint-disable-next-line import/no-extraneous-dependencies */
import React from 'react'

// From https://github.com/FortAwesome/react-fontawesome/issues/134#issuecomment-471940596
import '@fortawesome/fontawesome-svg-core/styles.css'

import { config, library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faLaughSquint,
  faExclamation,
  faCopy,
  faLink,
} from '@fortawesome/free-solid-svg-icons'

config.autoAddCss = false

library.add(
  faLaughSquint,
  faExclamation,
  faCopy,
  faLink,
)

const MAP = {
  fas: [
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
