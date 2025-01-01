"use client"

import { useAccount } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { Button } from '@/components/ui/button'

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount()
  const { open } = useWeb3Modal()

  if (!isConnected) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-white">Welcome to Hyder</h1>
          <p className="text-gray-400">Connect your wallet to continue</p>
          <Button 
            onClick={() => open()}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-6 text-lg"
          >
            Connect Wallet
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 