/**
 * Create `Error` instance with `details` member set to passed-in parameter.
 *
 * @param  {String} msg     Error message.
 * @param  {*} [details] Details to attach to `Error` object.
 * @return {Error}
 */
export const createErrorWithDetails = (msg, details) => {
  const e = new Error(msg)
  e.details = details
  return e
}
