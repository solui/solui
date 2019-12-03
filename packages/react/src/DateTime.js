/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useMemo } from 'react'
import { prettyDate } from '@solui/utils'

/**
 * Render a date-time value.
 * @return {ReactElement}
 */
const DateTime = ({ className, dateTime }) => {
  const dateTimeStr = useMemo(() => prettyDate(dateTime), [ dateTime ])

  return (
    <span className={className}>{dateTimeStr}</span>
  )
}

export default DateTime
