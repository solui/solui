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
  // layout
  layoutBgColor: 'rgba(62,0,135,1) linear-gradient(135deg, rgba(62, 0, 135, 1) 0%, rgba(100, 36, 167, 1) 44%, rgba(146, 80, 205, 1) 74%, rgba(202, 134, 252, 1) 100%)',
  // shadows
  boxShadowColor: opacify(black, 0.2),
  // interface
  interfaceBgColor: white,
  interfaceTextColor: black,
  interfaceShadowColor: darkGrey,
  interfaceMenuBorderColor: lightGrey,
  // credit
  creditTextColor: grey,
  creditAnchorTextColor: grey,
  creditAnchorHoverTextColor: white,
  creditAnchorHoverBgColor: primary,
  creditAnchorBorderBottomColor: grey,
  // modal
  modalOverlayBgColor: 'rgba(0, 0, 0, 0.8)',
  modalBgColor: white,
  modalTextColor: black,
  // network info component
  networkInfoIconColor: grey,
  networkInfoTextColor: darkGrey,
  // menu component
  menuButtonTextColor: black,
  menuButtonBgColor: 'transparent',
  menuBgColor: white,
  menuShadowColor: grey,
  menuItemHoverTextColor: white,
  menuItemHoverBgColor: primary,
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
  // linkButton component
  linkButtonBorderColor: transparent,
  linkButtonBgColor: transparent,
  linkButtonTextColor: 'inherit',
  linkButtonDisabledBorderColor: transparent,
  linkButtonDisabledBgColor: transparent,
  linkButtonDisabledTextColor: grey,
  linkButtonHoverBorderColor: transparent,
  linkButtonHoverBgColor: secondary,
  linkButtonHoverTextColor: white,
  linkButtonShadowColor: transparent,
  // result component
  resultBgColor: opacify(tertiary, 0.3),
  // tx component
  txBgColor: lighterGrey,
  txTextColor: black,
  // group component
  panelBorderColor: lightGrey,
  panelBgColor: white,
  panelActiveBgColor: white,
  panelActiveBorderColor: transparent,
  panelActiveShadowColor: opacify(black, 0.4),
  // generic input component
  inputLabelTextColor: black,
  inputBorderColor: lightGrey,
  inputFocusBorderColor: darkGrey,
  inputErrorBorderColor: red,
  inputBgColor: white,
  inputFocusBgColor: white,
  inputErrorBgColor: opacify(yellow, 0.1),
  inputTextColor: black,
  inputPlaceholderTextColor: lightGrey,
  inputHelpTextColor: darkGrey,
  inputMetaTextColor: black,
  inputMetaTextBgColor: opacify(secondary, 0.2),
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
