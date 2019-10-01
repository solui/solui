import FontFaceObserver from 'fontfaceobserver'

const DEFAULT_FONT = {
  name: 'Arial',
  weights: {
    thin: 100,
    regular: 400,
    bold: 700,
  },
  styles: {
    normal: 'normal',
  }
}

const loadedFonts = {}

export const loadFonts = (cfg, doc) => {
  const ret = Promise.all(Object.keys(cfg).map(id => {
    const { name } = cfg[id]

    console.log(`Waiting for font: ${name}`)

    const obs = new FontFaceObserver(name)

    return obs.load().then(() => {
      console.log(`Font loaded: ${name}`)

      loadedFonts[id] = cfg[id]
    }, err => {
      console.warn(`Error observing loading of font ${name}: ${err.message}`)
    })
  }))

  if (doc) {
    const l = doc.createElement('link')
    const fw = Object.values(cfg).reduce((m, v) => {
      const vw = Object.values(v.weights)
      const vwi = vw.map(vwv => `${vwv}i`)
      m.push(
        `${encodeURIComponent(v.name)}:${vw.join(',')},${vwi.join(',')}`
      )
      return m
    }, [])
    l.href = `https://fonts.googleapis.com/css?family=${fw.join('|')}`
    l.rel = 'stylesheet'
    doc.head.appendChild(l)
  }

  return ret
}

export const font = (id, weight = 'regular', style = 'normal') => {
  const f = loadedFonts[id] || DEFAULT_FONT

  return `
    font-family: '${f.name}', sans-serif;
    font-weight: ${f.weights[weight]};
    font-style: ${style};
  `
}
