'use client'

import { createContext, useState, ReactNode } from 'react'

type Chat = {
  name: string;
  publicKey: string;
  lastMessage: string;
  date: string;
  unread: number;
  isGroup?: boolean;
  members?: number;
}

type ChatContextType = {
  activeChat: Chat | null;
  setActiveChat: (chat: Chat | null) => void;
}

export const ChatContext = createContext<ChatContextType>({
  activeChat: null,
  setActiveChat: () => {},
})

export function ChatProvider({ children }: { children: ReactNode }) {
  const [activeChat, setActiveChat] = useState<Chat | null>(null)

  return (
    <ChatContext.Provider value={{ activeChat, setActiveChat }}>
      {children}
    </ChatContext.Provider>
  )
} 