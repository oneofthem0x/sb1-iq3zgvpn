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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEthSender } from "@/lib/eth"
import { useState } from "react"
import { Send } from "lucide-react"

export function SendEthDialog() {
  const [address, setAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const { sendEth, isLoading, isSuccess } = useEthSender()

  const handleSend = async () => {
    if (await sendEth(address, amount)) {
      setIsOpen(false)
      setAddress("")
      setAmount("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white">
          <Send className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle>Send ETH</DialogTitle>
          <DialogDescription className="text-gray-400">
            Send ETH to any address. Make sure to verify the address before sending.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="address">Recipient Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (ETH)</Label>
            <Input
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.1"
              type="number"
              step="0.0001"
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !address || !amount}
            className="bg-zinc-800 hover:bg-zinc-700"
          >
            {isLoading ? "Sending..." : "Send ETH"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 