import path from 'path'
import { loadSpecArtifacts } from '../../utils'
import { publish } from '../../'

export const getMeta = () => ({
  summary: 'Publish a Dapp to a local folder.',
  params: [
    {
      name: 'spec',
      typeLabel: '{underline file}',
      description: 'Path to the UI spec JSON file.'
    },
    {
      name: 'artifacts',
      typeLabel: '{underline folder}',
      description: 'Path to the folder containing the Truffle/Hardhat contract JSON artifacts.'
    },
    {
      name: 'folder',
      typeLabel: '{underline directory}',
      description: 'The local directory to publish to.',
    },
  ]
})

export const execute = async ({
  spec: specFile,
  artifacts: artifactsDir,
  folder,
}) => {
  const { spec, artifacts } = loadSpecArtifacts({ specFile, artifactsDir })

  const customFolder = path.resolve(process.cwd(), folder)

  await publish({ spec, artifacts, customFolder })
}
