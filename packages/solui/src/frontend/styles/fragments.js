export const flex = ({ direction = 'column', justify = 'center', align = 'center', basis = 'auto', wrap = 'nowrap' } = {}) => `
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justify};
  align-items: ${align};
  flex-wrap: ${wrap};
  flex: ${basis};
`

export const absoluteCover = () => `
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`

export const childAnchors = ({ textColor, hoverTextColor }) => `
  a {
    color: ${textColor};
    background-color: transparent;
    border-bottom: 1px solid ${textColor};
    &:visited, &:link {
      color: ${textColor};
      background-color: transparent;
      border-bottom: 1px solid ${textColor};
    }
    &:hover, &:active {
      color: ${hoverTextColor};
      background-color: ${textColor};
      border-bottom: 1px solid ${textColor};
    }
  }
`

export const smoothAnimation = () => `
  transition: all 0.3s linear
`

export const boxShadow = ({ color }) => `
  box-shadow: 0px 0px 5px 1px ${color}
`
