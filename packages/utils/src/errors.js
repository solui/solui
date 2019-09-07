export const createErrorWithDetails = (msg, details) => {
  const e = new Error(msg)
  e.details = details
  return e
}
