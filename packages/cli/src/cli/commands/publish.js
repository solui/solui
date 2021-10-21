import { loadSpecArtifacts } from '../../utils'
import { publish } from '../../'

export const getMeta = () => ({
  summary: 'Publish a Dapp to the solUI cloud.',
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
    }
  ]
})

export const execute = async ({
  spec: specFile,
  artifacts: artifactsDir,
}) => {
  const { spec, artifacts } = loadSpecArtifacts({ specFile, artifactsDir })

  await publish({ spec, artifacts })
}
