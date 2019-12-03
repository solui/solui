import { opacify } from '../color'

/*
  Palettes:
  * https://color.adobe.com/en/Mars-2-color-theme-13115904
  * https://colorhunt.co/palette/162500
*/

const yellow = '#ffd739'
const red = '#FF714F'
const white = '#fff'
const black = '#000'
const darkGrey = '#666'
const grey = '#999'
const lightGrey = '#ccc'
const lighterGrey = '#eee'

const transparent = 'transparent'

const primary = '#6807f9'
const secondary = '#9852f9'
const tertiary = '#98f907'

/**
 * Default theme.
 *
 * @type {Object}
 */
export default {
  black,
  white,
  grey,
  darkGrey,
  lightGrey,
  lighterGrey,
  yellow,
  red,
  primary,
  secondary,
  tertiary,
  transparent,
  // body
  bodyTextColor: white,
  // shadows
  boxShadowColor: opacify(black, 0.2),
  // interface
  interfaceBgColor: white,
  interfaceTextColor: black,
  interfaceShadowColor: darkGrey,
  // network info component
  networkInfoIconColor: grey,
  networkInfoTextColor: darkGrey,
  // button component
  buttonBorderColor: transparent,
  buttonBgColor: primary,
  buttonTextColor: white,
  buttonDisabledBorderColor: transparent,
  buttonDisabledBgColor: lightGrey,
  buttonDisabledTextColor: grey,
  buttonHoverBorderColor: transparent,
  buttonHoverBgColor: primary,
  buttonHoverTextColor: white,
  buttonShadowColor: grey,
  // iconButton component
  iconButtonBorderColor: secondary,
  iconButtonBgColor: transparent,
  iconButtonTextColor: secondary,
  iconButtonDisabledBorderColor: lightGrey,
  iconButtonDisabledBgColor: transparent,
  iconButtonDisabledTextColor: grey,
  iconButtonHoverBorderColor: secondary,
  iconButtonHoverBgColor: secondary,
  iconButtonHoverTextColor: white,
  iconButtonShadowColor: opacify(black, 0),
  // result component
  resultBgColor: opacify(tertiary, 0.3),
  // group component
  groupBorderColor: lightGrey,
  groupBgColor: white,
  groupActiveBgColor: white,
  groupActiveBorderColor: transparent,
  groupActiveShadowColor: opacify(black, 0.4),
  // panels
  panelBorderColor: lightGrey,
  panelActiveBorderColor: grey,
  panelBgColor: transparent,
  // generic input component
  inputLabelTextColor: black,
  inputBorderColor: lightGrey,
  inputFocusBorderColor: darkGrey,
  inputErrorBorderColor: red,
  inputBgColor: white,
  inputFocusBgColor: white,
  inputErrorBgColor: opacify(yellow, 0.1),
  inputTextColor: black,
  inputHelpTextColor: grey,
  inputPlaceholderTextColor: lightGrey,
  // alert component
  alertBgColor: opacify(tertiary, 0.3),
  alertIconColor: tertiary,
  alertTextColor: black,
  // error component
  errorBgColor: opacify(red, 0.3),
  errorIconColor: red,
  errorTextColor: black,
  // progress component
  progressBgColor: opacify(yellow, 0.2),
  progressIconColor: yellow,
  progressTextColor: black,
}
