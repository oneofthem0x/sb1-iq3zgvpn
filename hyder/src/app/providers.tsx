'use client'

import { WagmiProvider, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider, getDefaultConfig } from "connectkit"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ChatProvider } from "@/context/chat-context"

const config = createConfig(
  getDefaultConfig({
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [mainnet, sepolia],
    autoConnect: true,
    persistConnection: true,
  })
)

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <SidebarProvider>
            <ChatProvider>
              {children}
            </ChatProvider>
          </SidebarProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
} 