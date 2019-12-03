import { version } from '../../../package.json'

export const getMeta = () => ({
  summary: 'Display solUI version.',
})

export const execute = async () => {
  console.log(version)
}
