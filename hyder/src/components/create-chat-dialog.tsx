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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { PGPService } from "@/lib/pgp"

interface CreateChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateChat: (data: { name?: string, publicKey: string }) => void
}

export function CreateChatDialog({
  open,
  onOpenChange,
  onCreateChat,
}: CreateChatDialogProps) {
  const [publicKey, setPublicKey] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!publicKey.trim()) {
      setError('Public key is required')
      return
    }

    try {
      // Validate the public key format
      await PGPService.validatePublicKey(publicKey)
      
      onCreateChat({
        name: name.trim() || undefined,
        publicKey: publicKey.trim()
      })
      
      // Reset form
      setPublicKey('')
      setName('')
      setError('')
    } catch (err) {
      setError('Invalid public key format')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Chat</DialogTitle>
          <DialogDescription>
            Enter the recipient's public key to start a new encrypted chat.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name (optional)</Label>
            <Input
              id="name"
              placeholder="Enter chat name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="publicKey">Public Key</Label>
            <Input
              id="publicKey"
              placeholder="Paste recipient's public key"
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate}>Create Chat</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 