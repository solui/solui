import { sha3 } from 'web3-utils'

export const calculateVersionHash = ({ spec, artifacts }) => {
  const artifactNames = Object.keys(artifacts)
  artifactNames.sort((a, b) => a.localeCompare(b))
  const sortedArtifacts = artifactNames.map(k => artifacts[k])
  return sha3(JSON.stringify([ spec, sortedArtifacts ]))
}
