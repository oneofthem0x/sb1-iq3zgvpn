"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Search, Plus } from "lucide-react"
import { useAccount } from 'wagmi'

export function ChatSidebar() {
  const { address } = useAccount()
  
  // Format address to show first 6 and last 4 characters
  const formatAddress = (addr: string) => {
    if (!addr) return '0x'
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="h-full flex flex-col bg-black">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Messages</h2>
          <Button variant="ghost" size="icon" className="text-white">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="w-full justify-start gap-2 bg-zinc-800 text-white">
            <Search className="h-4 w-4" />
            Search messages...
          </Button>
        </div>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-2">
        {Array.from({length: 10}).map((_, i) => (
          <Button
            key={i}
            variant="ghost"
            className="w-full justify-start gap-2 p-2 my-1 text-white hover:bg-zinc-800"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>0x</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden text-left">
              <div className="font-medium">{formatAddress(address || '')}</div>
              <div className="text-sm text-gray-400 truncate">
                Latest message preview...
              </div>
            </div>
          </Button>
        ))}
      </ScrollArea>
    </div>
  )
}