import { loadSpecArtifacts } from '../../utils'
import { publish } from '../../'

export const getMeta = () => ({
  summary: 'Publish a UI spec to the solUI cloud.',
  params: [
    {
      name: 'spec',
      typeLabel: '{underline file}',
      description: 'Path to the UI spec JSON file.'
    },
    {
      name: 'artifacts',
      typeLabel: '{underline folder}',
      description: 'Path to the folder containing the contract JSON artifacts.'
    }
  ],
  options: [
    {
      name: 'custom-ipfs',
      description: 'A private/custom IPFS server to publish to instead of the solUI cloud. (Format: <PROTOCOL>://<HOST>:<PORT>/PATH/TO/IPFS/API)',
      defaultValue: '',
    },
  ]
})

export const execute = async ({
  spec: specFile,
  artifacts: artifactsDir,
  'custom-ipfs': customIpfs,
}) => {
  const { spec, artifacts } = loadSpecArtifacts({ specFile, artifactsDir })

  await publish({ spec, artifacts, customIpfs })
}
