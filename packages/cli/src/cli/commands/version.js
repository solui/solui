import { version } from '../../../package.json'

export const getMeta = () => ({
  summary: 'Display SolUI version.',
})

export const execute = async () => {
  console.log(version)
}
