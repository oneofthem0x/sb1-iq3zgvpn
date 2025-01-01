'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Archive, Trash, MoreVertical } from "lucide-react"
import { useContext, useState, useEffect } from 'react'
import { ChatContext } from '@/context/chat-context'
import { PGPService } from '@/lib/pgp'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAccount } from 'wagmi'

type Message = {
  id: string
  content: string
  sender: string
  timestamp: string
  encrypted?: string
  senderAddress?: string
}

export function ChatMain() {
  const { activeChat } = useContext(ChatContext)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [keys] = useState(() => PGPService.getStoredKeys())
  const { address } = useAccount()

  useEffect(() => {
    if (activeChat?.publicKey) {
      const chatKey = `chat_history_${activeChat.publicKey}`
      const savedMessages = localStorage.getItem(chatKey)
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages))
      } else {
        setMessages([])
      }
    }
  }, [activeChat?.publicKey])

  useEffect(() => {
    if (activeChat?.publicKey) {
      const chatKey = `chat_history_${activeChat.publicKey}`
      localStorage.setItem(chatKey, JSON.stringify(messages))
    }
  }, [messages, activeChat?.publicKey])

  const handleSendMessage = async () => {
    if (!activeChat || !message.trim() || !keys.privateKey || !address) return

    try {
      const encrypted = await PGPService.encryptMessage(message, activeChat.publicKey)
      
      const newMessage: Message = {
        id: Date.now().toString(),
        content: message,
        sender: 'me',
        senderAddress: address,
        timestamp: new Date().toLocaleString(),
        encrypted: encrypted as string
      }
      
      setMessages(prev => [...prev, newMessage])
      setMessage('')

      // Here you would send the encrypted message to your backend
      console.log('Encrypted message:', encrypted)
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  if (!activeChat) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-500">
        Select a chat to start messaging
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-gray-800">
        <div className="flex items-center gap-4 flex-1">
          <Avatar>
            <AvatarImage src={`https://avatar.vercel.sh/${activeChat.publicKey}`} />
            <AvatarFallback>{activeChat.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-white">
              {activeChat.name}
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              {activeChat.publicKey.slice(0, 10)}...{activeChat.publicKey.slice(-8)}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Archive className="mr-2 h-4 w-4" />
              Archive Chat
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender !== 'me' && (
                <Avatar className="mr-2">
                  <AvatarImage src={`https://avatar.vercel.sh/${msg.senderAddress || activeChat.publicKey}`} />
                  <AvatarFallback>{activeChat.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              )}
              <div className={`rounded-lg p-4 max-w-[70%] ${
                msg.sender === 'me' ? 'bg-blue-600 text-white ml-2' : 'bg-zinc-800 text-white'
              }`}>
                <p>{msg.content}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs opacity-70">
                    {msg.timestamp}
                  </span>
                  <span className="text-xs font-mono opacity-50">
                    {msg.senderAddress ? 
                      `${msg.senderAddress.slice(0, 6)}...${msg.senderAddress.slice(-4)}` : 
                      ''}
                  </span>
                </div>
              </div>
              {msg.sender === 'me' && (
                <Avatar className="ml-2">
                  <AvatarImage src={`https://avatar.vercel.sh/${address}`} />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <Input 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={keys.publicKey ? "Type a message..." : "Generate keys to start chatting"} 
            className="flex-1 bg-zinc-900 text-white border-zinc-800"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={!keys.publicKey}
          />
          <Button 
            size="icon" 
            className="bg-zinc-800 hover:bg-zinc-700"
            onClick={handleSendMessage}
            disabled={!keys.publicKey}
          >
            <Send className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>
    </div>
  )
} 