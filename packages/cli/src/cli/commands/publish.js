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
})

export const execute = async () => {
  console.log('publish')
}
