import axios from 'axios'
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { ContractFactory, Contract } from '@ethersproject/contracts'

import { isEthereumAddress } from './validation'
import { _ } from './lodash'
import { GLOBAL_SCOPE } from './platform'

const etherscanPrefix = {
  1: 'https://etherscan.io',
  3: 'https://ropsten.etherscan.io',
  4: 'https://rinkeby.etherscan.io',
  5: 'https://goerli.etherscan.io',
  42: 'https://kovan.etherscan.io',
}

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

const normalizeNetworkId = i => `${i}`

const _finalizeNetwork = async network => {
  const info = await network.node.getNetwork()

  network.id = normalizeNetworkId(info.chainId)
  network.name = getNetworkName(network.id)

  network.account = await getAccount(network.node)

  network.getEtherscanLink = addr => {
    if (etherscanPrefix[network.id]) {
      const type = (isEthereumAddress(addr) ? 'address' : 'tx')
      return `${etherscanPrefix[network.id]}/${type}/${addr}`
    } else {
      return null
    }
  }
}

/**
 * Get node connection pointing to given http endpoint URL.
 *
 * This will check to ensure that it is a valid Ethereum node endpoint.
 *
 * @name getNodeConnection
 * @param  {String}  url The node endpoint.
 * @return {Promise<Node>}
 */
export const getNodeConnection = async url => {
  const id = await axios.post(url, {
    jsonrpc: '2.0',
    method: 'net_version',
    params: [],
    id: 69,
  })

  if (id) {
    return new JsonRpcProvider(url)
  }

  throw new Error(`Unable to connect to network: ${url}`)
}


/**
 * Get node connection from given `Web3` connection.
 *
 * @param  {Web3}  web3 Web3 instance.
 * @return {Promise<Node>}
 */
export const getNodeConnectionFromWeb3 = async web3 => {
  return new Web3Provider(web3)
}


/**
 * @typedef {Object} NetworkInfo
 * @property {String} id Network id.
 * @property {String} name Network name.
 * @property {Node} node  Connection to node.
 * @property {Function} getEtherscanLink Get [Etherscan](https://etherscan.io/) link for given address.
*/


/**
 * Get network information from the node exposed in the Javascript global scope.
 *
 * This attemps to construct a node connection pointing to the Ethereum endpoint
 * accessible via the Global scope (whether in browser or server-side).
 *
 * @name getNetworkInfoFromGlobalScope
 * @return {Promise<NetworkInfo>}
 */
export const getNetworkInfoFromGlobalScope = async () => {
  try {
    const network = {}
    const extraProps = {
      askWalletOwnerForPermissionToViewAccounts: () => {}
    }

    if (GLOBAL_SCOPE.ethereum) {
      network.node = new Web3Provider(GLOBAL_SCOPE.ethereum)
      // See https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
      if (typeof _.get(GLOBAL_SCOPE.ethereum, 'enable') === 'function') {
        extraProps.askWalletOwnerForPermissionToViewAccounts =
          () => GLOBAL_SCOPE.ethereum.enable()
      }
      // From https://metamask.github.io/metamask-docs/API_Reference/Ethereum_Provider#ethereum.on(eventname%2C-callback
      // we will manually reload page on a network change
      GLOBAL_SCOPE.ethereum.autoRefreshOnNetworkChange = false
      if (GLOBAL_SCOPE.ethereum.on) {
        GLOBAL_SCOPE.ethereum.on('networkChanged', newNetworkId => {
          if (network.id && `${newNetworkId}` !== `${network.id}`) {
            if (typeof _.get(GLOBAL_SCOPE.location, 'reload') === 'function') {
              console.log(`Ethereum network changed to ${newNetworkId}, reloading ...`)
              GLOBAL_SCOPE.location.reload()
            }
          }
        })
      }
    } else if (GLOBAL_SCOPE.web3 && GLOBAL_SCOPE.web3.currentProvider) {
      network.node = new Web3Provider(GLOBAL_SCOPE.web3.currentProvider)
    } else {
      // try local node
      try {
        network.node = await getNodeConnection('http://localhost:8545')
      } catch (err) {
        console.warn(err)
      }
    }

    // if web3 not set then something failed
    if (!network.node) {
      throw new Error('Error setting up connection')
    }

    await _finalizeNetwork(network)

    Object.assign(network.node, extraProps)

    return network
  } catch (err) {
    console.error('Error fetching network info', err)

    throw err
  }
}

/**
 * Get network information from given node.
 *
 * @param  {Node}  node connection.
 * @return {Promise<NetworkInfo>}
 */
export const getNetworkInfo = async node => {
  const network = { node }

  await _finalizeNetwork(network)

  return network
}


/**
 * Get account address.
 *
 * @param  {Node}  node node.
 * @return {Promise<String>}  Account address.
 */
export const getAccount = async node => {
  if (node.askWalletOwnerForPermissionToViewAccounts) {
    await node.askWalletOwnerForPermissionToViewAccounts()
  }

  return node.getSigner(0).getAddress()
}


/**
 * Sign a message.
 *
 * @param  {Node}  node node.
 * @param  {String}  msg Message to sign.
 * @return {Promise<String>}  Signature.
 */
export const signMessage = async (node, msg) => {
  if (node.askWalletOwnerForPermissionToViewAccounts) {
    await node.askWalletOwnerForPermissionToViewAccounts()
  }

  return node.getSigner(0).signMessage(msg)
}

/**
 * Construct contract interface object for existing contract.
 *
 * @param {Object} params Parameters.
 * @param {Object} params.abi contract ABI
 * @param {Node} params.node connection
 * @param {String} params.address on-chain address.
 *
 * @return {Object}
 */
export const getContractAt = async ({ abi, node, address }) => {
  return new Contract(address, abi, node.getSigner(0))
}

/**
 * Construct contract interface object for deploying new contract instances.
 *
 * @param {Object} params Parameters.
 * @param {Object} params.abi contract ABI
 * @param {String} params.bytecode contract bytecode
 * @param {Node} params.node connection
 * @param {String} params.address on-chain address.
 *
 * @return {Object}
 */
export const getContractDeployer = async ({ abi, bytecode, node }) => {
  return new ContractFactory(abi, bytecode, node.getSigner(0))
}

/**
 * Get bytecode at given on-chain address.
 *
 * @param  {Node}  node node.
 * @param  {String}  address Address of contract.
 * @return {Promise<String>} Bytecode in hex format.
 */
export const getBytecode = async (node, address) => {
  const code = await node.getCode(address)
  return ('0x' === code) ? null : code
}

/**
 * Check that given Ethereum address is valid.
 *
 * @param  {String}  value  Ethereum address.
 * @param  {Node}  node node.
 * @param {Object} [options]  Additional options.
 * @param {Boolean} [options.allowContract=true] If false then address must not
 * be a contract address.
 * @param {Boolean} [options.allowEoa=true] If false then address must not
 * be a non-contract address.
 * @return {Promise} Resolves if checks pass, rejects if they fail.
 */
export const assertEthAddressIsValidOnChain = async (
  value,
  node,
  { allowContract = true, allowEoa = true } = {}
) => {
  if (!isEthereumAddress(value)) {
    throw new Error(`must be a valid address`)
  } else {
    // do the on-chain check...
    if (!node) {
      return
    }

    let isContract

    try {
      isContract = !!(await getBytecode(node, value))
    } catch (err) {
      throw new Error(`unable to check for code at address: ${err.message}`)
    }


    if (isContract && !allowContract) {
      throw new Error('must NOT be an on-chain contract address')
    }

    if (!isContract && !allowEoa) {
      throw new Error('must be an on-chain contract address')
    }
  }
}
