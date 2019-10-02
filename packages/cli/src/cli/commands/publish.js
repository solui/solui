import { loadSpecArtifacts } from '../../utils'
import { publish } from '../../'

export const getMeta = () => ({
  summary: 'Publish a UI spec to the solui spec repository.',
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
      name: 'bytecode-hashes',
      description: 'Publish hashes of deployed contract bytecodes so that users can search by contract address later on. This is an EXPERIMENTAL feature. (default: off).',
      type: Boolean,
    },
    {
      name: 'network',
      description: 'JSON-RPC HTTP endpoint for Ethereum network to be used for obtaining deployed contract bytecodes (default: http://localhost:8545).',
      defaultValue: 'http://localhost:8545',
    },
  ],
})

export const execute = async ({
  spec: specFile,
  artifacts: artifactsDir,
  network: testNetworkRpc,
  'bytecode-hashes': publishBytecodeHashes,
}) => {
  const { spec, artifacts } = loadSpecArtifacts({ specFile, artifactsDir })

  await publish({ spec, artifacts, testNetworkRpc, publishBytecodeHashes })
}
