/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useMemo } from 'react'
import { prettyDate } from '@solui/utils'

export default ({ className, dateTime }) => {
  const dateTimeStr = useMemo(() => prettyDate(dateTime), [ dateTime ])

  return (
    <span className={className}>{dateTimeStr}</span>
  )
}
