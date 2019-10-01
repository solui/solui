import {
  format,
  toDate as toDateOrig,
  parseISO,
} from 'date-fns'

export const toDate = d => {
  if (typeof d === 'string') {
    return parseISO(d)
  } else {
    return toDateOrig(d)
  }
}

export const prettyDate = d => {
  try {
    return format(toDate(d), 'MMM d, yyyy')
  } catch (err) {
    console.error(`Error formatting date: ${d}`, err)
    return ''
  }
}
