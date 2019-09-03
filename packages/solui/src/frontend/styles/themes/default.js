import Color from 'color'

// Theme: https://color.adobe.com/en/Mars-2-color-theme-13115904
const cs1 = '#FFF5EA'
const cs2 = '#23AD7B'
const cs3 = '#26303D'
const cs4 = '#FF714F'
const cs5 = '#FFCC63'

const white = '#fff'
const black = '#000'
const grey = '#999'
const lightGrey = '#ccc'
const lightGreen = '#afa'

const transparent = 'transparent'

export default {
  bodyBgColor: white,
  bodyTextColor: black,
  resultBgColor: lightGreen,
  // button component
  buttonBorderColor: 'transparent',
  buttonBgColor: Color(cs5).alpha(0.7).toString(),
  buttonTextColor: black,
  buttonDisabledBgColor: Color(cs5).alpha(0.3).toString(),
  buttonDisabledTextColor: lightGrey,
  buttonHoverBgColor: cs5,
  buttonHoverTextColor: black,
  buttonShadowColor: Color(black).alpha(0.3).toString(),
  // group component
  groupBorderColor: lightGrey,
  groupBgColor: white,
  groupActiveBgColor: white,
  groupActiveBorderColor: transparent,
  groupActiveShadowColor: Color(black).alpha(0.4).toString(),
  // panels
  panelBorderColor: lightGrey,
  panelActiveBorderColor: grey,
  panelBgColor: transparent,
  // generic input component
  inputLabelTextColor: black,
  inputBorderColor: lightGrey,
  inputFocusBorderColor: black,
  inputErrorBorderColor: cs4,
  inputBgColor: white,
  inputFocusBgColor: white,
  inputErrorBgColor: cs1,
  inputTextColor: black,
  // error component
  errorBgColor: Color(cs4).rgb().alpha(0.3).toString(),
  errorIconColor: cs4,
  errorTextColor: black,
  // progress component
  progressBgColor: Color(cs2).rgb().alpha(0.3).toString(),
  progressIconColor: cs2,
  progressTextColor: black,
  // network info component
  networkInfoBgColor: cs3,
  networkInfoTextColor: white,
}
