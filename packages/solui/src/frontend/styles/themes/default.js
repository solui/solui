import Color from 'color'

// Theme: https://color.adobe.com/en/Mars-2-color-theme-13115904
const mars1 = '#FFF5EA'
const mars2 = '#23AD7B'
const mars3 = '#26303D'
const mars4 = '#FF714F'
const mars5 = '#FFCC63'

const white = '#fff'
const red = '#f00'
const black = '#000'
const lightGrey = '#ccc'
const lightestGrey = '#f0f0f0'
const lightGreen = '#afa'

export default {
  bodyBgColor: white,
  bodyTextColor: black,
  groupBorderColor: red,
  panelBorderColor: lightGrey,
  resultBgColor: lightGreen,
  imgBorderColor: lightestGrey,
  groupBgColor: white,
  groupActiveBgColor: lightestGrey,
  // error component
  errorBgColor: Color(mars4).rgb().alpha(0.3).toString(),
  errorIconColor: mars4,
  errorTextColor: black,
  // progress component
  progressBgColor: Color(mars2).rgb().alpha(0.3).toString(),
  progressIconColor: mars2,
  progressTextColor: black,
  // network info component
  networkInfoBgColor: mars3,
  networkInfoTextColor: white,
}
