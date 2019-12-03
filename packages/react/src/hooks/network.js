/* eslint-disable-next-line import/no-extraneous-dependencies */
import { useContext } from 'react'

import { NetworkContext } from '../contexts'

/**
 * Hook for obtaining current network context.
 *
 * @see {NetworkContext}
 * @return {NetworkInfo}
 */
export const useNetwork = () => {
  const { network } = useContext(NetworkContext)
  return network
}
