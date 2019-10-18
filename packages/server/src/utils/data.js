import { hash } from '@solui/utils'

export const calculateVersionHash = ({ spec, artifacts }) => {
  const artifactNames = Object.keys(artifacts)
  artifactNames.sort((a, b) => a.localeCompare(b))
  const sortedArtifacts = artifactNames.map(k => artifacts[k])
  return hash([ spec, sortedArtifacts ])
}
