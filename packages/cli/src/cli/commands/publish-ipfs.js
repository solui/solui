import { loadSpecArtifacts } from '../../utils'
import { publish } from '../../'

export const getMeta = () => ({
  summary: 'Publish a Dapp to an IPFS node.',
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
      name: 'ipfs',
      typeLabel: '{underline endpoint}',
      description: 'The IPFS endpoint to publish to. (Format: <PROTOCOL>://<HOST>:<PORT>/PATH/TO/IPFS/API)',
    },
  ]
})

export const execute = async ({
  spec: specFile,
  artifacts: artifactsDir,
  ipfs: customIpfs,
}) => {
  const { spec, artifacts } = loadSpecArtifacts({ specFile, artifactsDir })

  await publish({ spec, artifacts, customIpfs })
}
