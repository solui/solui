import { _ } from '@solui/utils'


export const ARRAY_INPUT_TYPE_COMMA = 'COMMA'

export const ARRAY_INPUT_TYPE_LINE = 'LINE'


export const decodeArrayInputFromUser = (inputValue, inputType) => {
  switch (inputType) {
    case ARRAY_INPUT_TYPE_COMMA:
      return inputValue.split(',').map(v => _.trimStr(v))
    case ARRAY_INPUT_TYPE_LINE:
      return inputValue.split("\n").map(v => _.trimStr(v))
  }
}


export const encodeArrayInputForUser = (arrayValue, inputType) => {
  const sanitizedValue = arrayValue || []

  switch (inputType) {
    case ARRAY_INPUT_TYPE_COMMA:
      return sanitizedValue.join(',')
    case ARRAY_INPUT_TYPE_LINE:
      return sanitizedValue.join("\n")
  }
}


