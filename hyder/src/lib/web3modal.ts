import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { mainnet, sepolia } from 'viem/chains'

const projectId = '25db67357143aebf521da60e99026282'

const metadata = {
  name: 'Hyder',
  description: 'Communicate in the shadows',
  url: 'https://hyder.io',
  icons: ['/favicon.png']
}

const chains = [mainnet, sepolia]

export const config = defaultWagmiConfig({ 
  chains, 
  projectId, 
  metadata,
  enableWalletConnect: true,  // This enables all WalletConnect v2 wallets
  enableInjected: true,       // This enables MetaMask and similar injected wallets
  enableEIP6963: true,        // This enables detection of all EIP-6963 compatible wallets
})

createWeb3Modal({ 
  wagmiConfig: config, 
  projectId, 
  chains,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': '#000000',
    '--w3m-color-mix-strength': 30,
  },
  defaultChain: mainnet,
  // Try these settings
  enableEmailLogin: false,
  enableSocialLogin: false,
  enableOnrampProvider: false,
  enableLocalization: false,
  enableTheming: true,
  enableAnalytics: false,
  enableAuthMode: false,
  enableNetworkView: true,
  enableWalletFeatures: true,
}) 