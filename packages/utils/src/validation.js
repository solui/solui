import validator from 'validator'

export const isEmail = val => {
  if (!val) {
    return null
  } else {
    return validator.isEmail(val)
  }
}
