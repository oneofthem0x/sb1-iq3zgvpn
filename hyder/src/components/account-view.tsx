"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAccount } from 'wagmi'
import { useState } from "react"
import { Copy, Check } from "lucide-react"

interface AccountViewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccountView({ open, onOpenChange }: AccountViewProps) {
  const { address } = useAccount()
  const [copied, setCopied] = useState<'public' | 'private' | null>(null)

  const publicKey = localStorage.getItem('pgp-public-key')
  const privateKey = localStorage.getItem('pgp-private-key')

  const copyToClipboard = async (text: string, type: 'public' | 'private') => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle>Your PGP Keys</DialogTitle>
          <DialogDescription className="text-gray-400">
            Keep your private key secure and never share it with anyone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Public Key</label>
            <div className="relative">
              <pre className="rounded-lg bg-zinc-800 p-4 text-xs font-mono overflow-auto max-h-40">
                {publicKey || 'No public key generated'}
              </pre>
              {publicKey && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => copyToClipboard(publicKey, 'public')}
                >
                  {copied === 'public' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Private Key</label>
            <div className="relative">
              <pre className="rounded-lg bg-zinc-800 p-4 text-xs font-mono overflow-auto max-h-40">
                {privateKey || 'No private key generated'}
              </pre>
              {privateKey && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => copyToClipboard(privateKey, 'private')}
                >
                  {copied === 'private' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 