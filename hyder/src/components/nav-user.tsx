"use client"

import { Button } from "@/components/ui/button"
import { useAccount } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useEffect, useState } from "react"
import { PGPService } from "@/lib/pgp"
import { KeysDialog } from "./keys-dialog"

export function NavUser() {
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()
  const [showKeys, setShowKeys] = useState(false)

  const formatAddress = (addr: string) => {
    if (!addr) return '0x'
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  useEffect(() => {
    if (isConnected && address) {
      // Check if this wallet already has keys
      const storedKeys = localStorage.getItem(`pgp-keys-${address}`)
      if (!storedKeys) {
        // Generate new keys for this wallet
        PGPService.generateKeyPair(address, `${address}@hyder.io`).then(keys => {
          localStorage.setItem(`pgp-keys-${address}`, JSON.stringify(keys))
          localStorage.setItem('pgp-public-key', keys.publicKey)
          localStorage.setItem('pgp-private-key', keys.privateKey)
          // Show keys dialog on first connect
          setShowKeys(true)
        })
      } else {
        // Load existing keys for this wallet
        const keys = JSON.parse(storedKeys)
        localStorage.setItem('pgp-public-key', keys.publicKey)
        localStorage.setItem('pgp-private-key', keys.privateKey)
      }
    } else {
      // Clear current keys when disconnected
      localStorage.removeItem('pgp-public-key')
      localStorage.removeItem('pgp-private-key')
    }
  }, [isConnected, address])

  return (
    <>
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 text-white hover:bg-zinc-800 md:h-8 md:p-0"
        onClick={() => open({ view: 'Account' })}
      >
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-zinc-800 text-sm">
          0x
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="font-medium text-white">{formatAddress(address || '')}</div>
          <div className="text-xs text-gray-400">Connected</div>
        </div>
      </Button>
      <KeysDialog open={showKeys} onOpenChange={setShowKeys} />
    </>
  )
}