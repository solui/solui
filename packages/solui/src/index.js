import { validate } from './spec'

export class Generator {
  constructor (artifactsDir, ui) {
    this.artifactsDir = artifactsDir
    this.ui = ui
  }

  async start () {
    // todo
  }
}

export const startGenerator = async ({ artifactsDir, ui }) => {
  await validate(ui)

  const g = new Generator({ artifactsDir, ui })
  await g.start()

  return g
}
