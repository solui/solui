import { loadSpec, loadArtifacts, watch, logInfo, loadSpecArtifacts } from '../../utils'
import { startViewer } from '../../'

export const getMeta = () => ({
  summary: 'Render a UI spec and interact with it in your browser.',
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
  ],
  options: [
    {
      name: 'port',
      description: 'HTTP listening port for web interface (default: 3001).',
      defaultValue: '3001',
    },
    {
      name: 'verbose',
      type: Boolean,
      description: 'Enable verbose logging (default: off).',
    },
  ]
})

export const execute = async ({ spec: specFile, artifacts: artifactsDir, port, verbose }) => {
  const { spec, artifacts } = loadSpecArtifacts({ specFile, artifactsDir })

  // start generator
  const instance = await startViewer({ artifacts, spec, port, verbose })

  logInfo(`Interface available at: ${instance.getLocalEndpoint()}`)

  // watch for changes
  watch(specFile, () => instance.updateSpec(loadSpec(specFile)))
  watch(artifactsDir, () => instance.updateArtifacts(loadArtifacts(artifactsDir)))
}
