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
      name: 'verbose',
      type: Boolean,
      description: 'Enable verbose logging.'
    },
  ]
})
