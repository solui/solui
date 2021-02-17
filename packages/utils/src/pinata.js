import pinataSDK from '@pinata/sdk'

export const connectToPinata = async (apiKey, secretKey) => {
  return pinataSDK(apiKey, secretKey)
}


