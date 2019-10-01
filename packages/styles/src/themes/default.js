import Color from 'color'

// Theme: https://color.adobe.com/en/Mars-2-color-theme-13115904
const cs1 = '#FFF5EA'
const cs2 = '#23AD7B'
const cs3 = '#26303D'
const cs4 = '#FF714F'
const cs5 = '#FFCC63'

const white = '#fff'
const black = '#000'
const darkGrey = '#666'
const grey = '#999'
const lightGrey = '#ccc'
const lighterGrey = '#eee'

const transparent = 'transparent'

const opacify = (c, a) => Color(c).alpha(a).toString()

export default {
  bodyBgColor: white,
  bodyTextColor: black,
  // shadows
  boxShadowColor: opacify(black, 0.2),
  // result component
  resultBgColor: opacify(cs2, 0.4),
  // button component
  buttonBorderColor: transparent,
  buttonBgColor: cs3,
  buttonTextColor: white,
  buttonDisabledBorderColor: transparent,
  buttonDisabledBgColor: lightGrey,
  buttonDisabledTextColor: grey,
  buttonHoverBorderColor: transparent,
  buttonHoverBgColor: cs3,
  buttonHoverTextColor: white,
  buttonShadowColor: opacify(black, 0.3),
  // iconButton component
  iconButtonBorderColor: cs3,
  iconButtonBgColor: transparent,
  iconButtonTextColor: cs3,
  iconButtonDisabledBorderColor: lightGrey,
  iconButtonDisabledBgColor: transparent,
  iconButtonDisabledTextColor: grey,
  iconButtonHoverBorderColor: cs3,
  iconButtonHoverBgColor: cs3,
  iconButtonHoverTextColor: white,
  iconButtonShadowColor: opacify(black, 0),
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
  inputFocusBorderColor: black,
  inputErrorBorderColor: cs4,
  inputBgColor: white,
  inputFocusBgColor: white,
  inputErrorBgColor: cs1,
  inputTextColor: black,
  inputPlaceholderTextColor: lightGrey,
  // alert component
  alertBgColor: opacify(cs2, 0.3),
  alertIconColor: cs2,
  alertTextColor: black,
  // error component
  errorBgColor: opacify(cs4, 0.3),
  errorIconColor: cs4,
  errorTextColor: black,
  // progress component
  progressBgColor: opacify(cs2, 0.3),
  progressIconColor: cs2,
  progressTextColor: black,
  // header component
  headerBgColor: cs3,
  headerTextColor: white,
  // search common
  searchResultsMetaTextColor: darkGrey,
  // search popup
  searchResultsPopupBackgroundColor: white,
  searchResultsPopupItemBorderColor: lightGrey,
  searchResultsPopupItemHoverBgColor: lightGrey,
  // search page
  searchResultsPageEvenItemBgColor: lighterGrey,
  searchResultsPageOddItemBgColor: transparent,
  searchResultsPageItemHoverBgColor: lightGrey,
  // search results
  searchResultTitleTextColor: black,
  searchResultSummaryTextColor: grey,
  searchResultMetaTextColor: grey,
  // pkg info
  dappPkgInfoBgColor: opacify(cs3, 0.3),
}
