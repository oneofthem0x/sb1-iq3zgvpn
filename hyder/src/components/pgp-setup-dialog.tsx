"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PGPService } from "@/lib/pgp"
import { useState } from "react"
import { Key } from "lucide-react"
import { useAccount } from 'wagmi'

export function PGPSetupDialog() {
  const { address } = useAccount()
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!address) return

    try {
      setIsGenerating(true)
      // Use wallet address instead of name/email
      const keys = await PGPService.generateKeyPair(address, `${address}@hyder.io`)
      // Store keys securely (you might want to use a better storage solution)
      localStorage.setItem('pgp-private-key', keys.privateKey)
      localStorage.setItem('pgp-public-key', keys.publicKey)
      setIsOpen(false)
    } catch (error) {
      console.error('Error generating keys:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const hasExistingKeys = !!localStorage.getItem('pgp-private-key')

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white">
          <Key className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle>PGP Keys</DialogTitle>
          <DialogDescription className="text-gray-400">
            {hasExistingKeys 
              ? "You already have PGP keys generated. Generating new keys will replace your existing ones."
              : "Generate a new PGP key pair for encrypted messaging using your wallet address."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="rounded-lg bg-zinc-800 p-4 text-sm font-mono">
            {address || 'Connect wallet to generate keys'}
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !address}
            className="bg-zinc-800 hover:bg-zinc-700"
          >
            {isGenerating ? "Generating..." : hasExistingKeys ? "Regenerate Keys" : "Generate Keys"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 