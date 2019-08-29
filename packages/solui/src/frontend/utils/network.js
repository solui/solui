import Web3 from 'web3'
import axios from 'axios'

let network

const getNetworkName = id => {
  switch (id) {
    case '1':
      return 'Mainnet'
    case '3':
      return 'Ropsten'
    case '4':
      return 'Rinkeby'
    case '5':
      return 'Görli'
    case '42':
      return `Kovan`
    default:
      return 'Dev/Private'
  }
}

export const getNetwork = async () => {
  if (!network) {
    try {
      network = {}

      if (window.ethereum) {
        network.web3 = new Web3(window.ethereum)
        // See https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
        network.web3.requestPermission = () => window.ethereum.enable()
        // From https://metamask.github.io/metamask-docs/API_Reference/Ethereum_Provider#ethereum.on(eventname%2C-callback
        // we will manually reload page on a network change
        window.ethereum.autoRefreshOnNetworkChange = false
        if (window.ethereum.on) {
          window.ethereum.on('networkChanged', () => window.location.reload())
        }
      } else if (window.web3 && window.web3.currentProvider) {
        network.web3 = new Web3(window.web3.currentProvider)
      } else {
        // try local node
        const url = 'http://localhost:8545'

        try {
          network.id = await axios.post(url, {
            jsonrpc: '2.0',
            method: 'net_version',
            params: [],
            id: 69,
          })
          network.web3 = new Web3(new Web3.providers.HttpProvider(url))
        } catch (err) {
          console.warn(err)
        }
      }

      // if web3 not set then something failed
      if (!network.web3) {
        throw new Error('Error setting up web3')
      }

      network.id = `${await network.web3.eth.net.getId()}`
      network.name = getNetworkName(network.networkId)
    } catch (err) {
      network = null
      throw err
    }
  }

  return network
}
