"use client"

import { useState, useEffect } from 'react'
import { ChatService } from '@/lib/chat'
import { GroupChatService } from '@/lib/group-chat'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { useAccount } from 'wagmi'

interface Message {
  id: string
  from: string
  content: string
  timestamp: number
  status: 'sent' | 'delivered' | 'read'
}

interface ChatProps {
  chat: ChatService | GroupChatService
}

export function Chat({ chat }: ChatProps) {
  const { address } = useAccount()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    // Load chat history
    const history = chat.getMessageHistory()
    setMessages(history)

    // Subscribe to new messages
    chat.onMessage((message: Message) => {
      setMessages(prev => [...prev, message])
    })

    // Subscribe to message status updates
    chat.onStatusUpdate((messageId: string, status: Message['status']) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      ))
    })

    return () => {
      // Cleanup subscriptions if needed
      chat.disconnect?.()
    }
  }, [chat])

  const sendMessage = async () => {
    if (!newMessage.trim() || !address) return

    try {
      await chat.sendMessage(newMessage.trim())
      setNewMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.from === address ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.from === address
                    ? 'bg-zinc-800 text-white'
                    : 'bg-zinc-700 text-white'
                }`}
              >
                <div className="break-words">{message.content}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                  {message.from === address && (
                    <span className="ml-2">
                      {message.status === 'sent' && '✓'}
                      {message.status === 'delivered' && '✓✓'}
                      {message.status === 'read' && '✓✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-zinc-800">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="bg-zinc-800 border-zinc-700"
          />
          <Button
            onClick={sendMessage}
            className="bg-zinc-800 hover:bg-zinc-700"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
} 