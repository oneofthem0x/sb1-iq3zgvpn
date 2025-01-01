import { cookieStorage, createStorage } from '@wagmi/core'
import { mainnet, arbitrum, polygon, optimism, sepolia } from 'viem/chains'
import { defaultWagmiConfig } from '@web3modal/wagmi/react'

export const projectId = '7e5433380003bd8ddc7e1415bdd22ed8'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const metadata = {
  name: 'Hyder',
  description: 'Communicate in the shadows',
  url: 'https://hyder.io',
  icons: ['/favicon.png']
}

export const networks = [mainnet, arbitrum, polygon, optimism, sepolia]

export const config = defaultWagmiConfig({
  chains: networks,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
}) 