module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      gas: 6712388,
      network_id: '*'
    },
  },

  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      currency: 'USD',
      gasPrice: 1
    },
    timeout: 100000,
  },

  compilers: {
    solc: {
      version: '0.5.10',
    }
  }
}
