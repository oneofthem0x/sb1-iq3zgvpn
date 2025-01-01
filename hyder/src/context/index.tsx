'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config, projectId, networks } from '@/config'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { WagmiProvider } from 'wagmi'
import { type ReactNode } from 'react'

const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Initialize the Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains: networks,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': '#000000',
    '--w3m-color-mix-strength': 30,
  },
})

function ContextProvider({ 
  children 
}: { 
  children: ReactNode
  cookies?: string | null 
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider 