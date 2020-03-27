/* eslint-disable-next-line import/no-extraneous-dependencies */
import React, { useMemo } from 'react'
import { prettyDate } from '@solui/utils'

/**
 * Render a date-time value.
 * @return {ReactElement}
 */
const DateTime = ({ className, dateTime, withTime }) => {
  const dateTimeStr = useMemo(() => prettyDate(dateTime, withTime ? 'MMM d, yyyy @ HH:mm' : null), [ dateTime ])

  return (
    <span className={className}>{dateTimeStr}</span>
  )
}

export default DateTime
