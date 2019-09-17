const openSansWeight = {
  regular: 400,
  bold: 700,
}

const robotoWeight = {
  thin: 100,
  regular: 400,
  bold: 700,
}

export const openSansFont = (weight = 'regular') => `
  font-family: 'Open Sans', sans-serif;
  font-weight: ${openSansWeight[weight]};
`

export const robotoFont = (weight = 'regular') => `
  font-family: 'Roboto', sans-serif;
  font-weight: ${robotoWeight[weight]};
`
