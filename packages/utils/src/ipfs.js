import { URL } from 'url'
import { Buffer } from 'buffer'
import ipfsClient from 'ipfs-http-client'

const DEFAULT_PORTS = {
  ftp: 21,
  gopher: 70,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443,
}

const getClient = (ipfsEndpoint, options = {}) => {
  const u = new URL(ipfsEndpoint)

  const proto = u.protocol.slice(0, -1)

  return ipfsClient({
    protocol: proto,
    host: u.hostname,
    /*
      URL parser returns empty if port matches protocol default, so we manually apply it here
      @see https://nodejs.org/api/url.html#url_url_port)
    */
    port: u.port || DEFAULT_PORTS[proto] || '5001',
    apiPath: u.pathname,
    ...options,
  })
}

export const uploadDataToIpfs = async (str, ipfsEndpoint, clientOptions) => {
  const ipfs = getClient(ipfsEndpoint, clientOptions)

  return ipfs.add(Buffer.from(str))
}

export const uploadFolderToIpfs = async (folder, ipfsEndpoint, clientOptions) => {
  const ipfs = getClient(ipfsEndpoint, clientOptions)

  return ipfs.addFromFs(folder, { recursive: true })
}

