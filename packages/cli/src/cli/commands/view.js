import chalk from 'chalk'

import { loadSpec, loadArtifacts, watch } from '../utils'
import { startGenerator } from '../../'

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
      description: 'Path to the folder containing the contract JSON artifacts.'
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
  // load data
  const spec = loadSpec(specFile)
  const artifacts = loadArtifacts(artifactsDir)

  // start generator
  const instance = await startGenerator({ artifacts, spec, port, debug: verbose })

  console.log(chalk.white(`Loaded ${Object.keys(artifacts).length} contracts from directory: ${artifactsDir}`))
  console.log(chalk.white(`Loaded UI spec from: ${specFile}`))
  console.log('')
  console.log(chalk.cyan(`Interface available at: ${instance.getLocalEndpoint()}`))

  // watch for changes
  watch(specFile, () => instance.updateSpec(loadSpec(specFile)))
  watch(artifactsDir, () => instance.updateArtifacts(loadArtifacts(artifactsDir)))
}
