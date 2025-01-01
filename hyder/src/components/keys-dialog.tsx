"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { Copy, Check, AlertCircle } from "lucide-react"
import { useAccount } from 'wagmi'
import { PGPService } from "@/lib/pgp"

interface KeysDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeysDialog({
  open,
  onOpenChange,
}: KeysDialogProps) {
  const { address } = useAccount()
  const [keys, setKeys] = useState(() => PGPService.getStoredKeys())
  const [copiedPublic, setCopiedPublic] = useState(false)
  const [copiedPrivate, setCopiedPrivate] = useState(false)

  const handleGenerateKeys = async () => {
    if (!address) return

    try {
      const newKeys = await PGPService.generateKeyPair(
        address,
        `${address}@hyder.chat`
      )
      
      await PGPService.storeKeys(newKeys.publicKey, newKeys.privateKey)
      setKeys({ publicKey: newKeys.publicKey, privateKey: newKeys.privateKey })
    } catch (error) {
      console.error('Failed to generate keys:', error)
    }
  }

  const copyPublicKey = () => {
    if (keys.publicKey) {
      navigator.clipboard.writeText(keys.publicKey)
      setCopiedPublic(true)
      setTimeout(() => setCopiedPublic(false), 2000)
    }
  }

  const copyPrivateKey = () => {
    if (keys.privateKey) {
      navigator.clipboard.writeText(keys.privateKey)
      setCopiedPrivate(true)
      setTimeout(() => setCopiedPrivate(false), 2000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 text-white border-zinc-800 sm:max-w-[425px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-white">PGP Keys</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Generate or manage your PGP keys for encrypted messaging.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6">
          {keys.publicKey ? (
            <ScrollArea className="h-[300px] pr-2" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#666666 transparent'
            }}>
              <div className="grid gap-4 pr-2">
                <div className="grid gap-2">
                  <Label className="text-zinc-300">Your Public Key</Label>
                  <div className="relative">
                    <pre className="p-2 bg-zinc-950 rounded-md text-[11px] leading-tight text-zinc-300 overflow-auto font-mono border border-zinc-800 w-full max-h-[100px]">
                      {keys.publicKey}
                    </pre>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-1 right-1 h-6 w-6 hover:bg-zinc-800 text-zinc-400"
                      onClick={copyPublicKey}
                    >
                      {copiedPublic ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-zinc-300">Your Private Key</Label>
                    <div className="flex items-center text-amber-500 text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Never share your private key
                    </div>
                  </div>
                  <div className="relative">
                    <pre className="p-2 bg-zinc-950 rounded-md text-[11px] leading-tight text-zinc-300 overflow-auto font-mono border border-zinc-800 w-full max-h-[100px]">
                      {keys.privateKey}
                    </pre>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-1 right-1 h-6 w-6 hover:bg-zinc-800 text-zinc-400"
                      onClick={copyPrivateKey}
                    >
                      {copiedPrivate ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-zinc-400 mb-4">
                No keys found. Generate a new key pair to start chatting.
              </p>
              <Button 
                onClick={handleGenerateKeys} 
                disabled={!address}
                className="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700"
              >
                Generate Keys
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 