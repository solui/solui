import { getClientSideAppState } from './globalState'

export const getInitialPageProps = async () => {
  const hasProcess = (typeof process !== 'undefined' && !!(process.env))

  return {
    appState: {
      // NOTE: next.js env var processor requires us to write "process.env.<...>" syntax in full
      BASE_URL: (hasProcess ? process.env.BASE_URL : getClientSideAppState('BASE_URL')),
    }
  }
}
