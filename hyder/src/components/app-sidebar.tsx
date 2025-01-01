"use client"

import * as React from "react"
import { ArchiveX, Command, File, Inbox, Send, Trash2, Key, Plus, Users2 } from "lucide-react"
import Image from "next/image"
import { useContext } from "react"

import { NavUser } from "@/components/nav-user"
import { Label } from "@/components/ui/label"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { KeysDialog } from "./keys-dialog"
import { CreateChatDialog } from "./create-chat-dialog"
import { ChatMain } from "./chat-main"
import { ChatContext } from '@/context/chat-context'

// This is sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Inbox",
      icon: Inbox,
    },
    {
      title: "Sent",
      icon: Send,
    },
  ],
  chats: [
    {
      name: "0xButterfly",
      publicKey: "0x123...abc",
      lastMessage: "Hey, have you checked out the new dApp?",
      date: "09:34 AM",
      unread: 2,
    },
    {
      name: "0xPhoenix",
      publicKey: "0x456...def",
      lastMessage: "Thanks for the ETH! 🙏",
      date: "Yesterday",
      unread: 0,
    },
    {
      name: "0xDAO",
      publicKey: "0x789...ghi",
      lastMessage: "Who's going to ETH Denver?",
      date: "2 days ago",
      isGroup: true,
      members: 5,
      unread: 12,
    },
    {
      name: "0xDragon",
      publicKey: "0xabc...123",
      lastMessage: "Let me review that smart contract",
      date: "3 days ago",
      unread: 0,
    },
    {
      name: "0xWhale",
      publicKey: "0xdef...456",
      lastMessage: "New yield farming opportunity just dropped",
      date: "1 week ago",
      isGroup: true,
      members: 8,
      unread: 3,
    }
  ]
}

// Define the Chat type
type Chat = {
  name: string;
  publicKey: string;
  lastMessage: string;
  date: string;
  unread: number;
  isGroup?: boolean;
  members?: number;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState(data.navMain[0])
  const [chats, setChats] = React.useState(data.chats)
  const { activeChat, setActiveChat } = useContext(ChatContext)
  const { setOpen } = useSidebar()
  const [showKeys, setShowKeys] = React.useState(false)
  const [showCreateChat, setShowCreateChat] = React.useState(false)

  const handleCreateChat = (data: { name?: string, publicKey: string }) => {
    const newChat = {
      name: data.name || data.publicKey.slice(0, 10) + '...',
      publicKey: data.publicKey,
      lastMessage: "Chat created",
      date: new Date().toLocaleString(),
      unread: 0
    }
    
    setChats(prev => [...prev, newChat])
    setActiveChat(newChat)
    setShowCreateChat(false)
  }

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden text-white [&>[data-sidebar=sidebar]]:flex-row [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#666666] [&::-webkit-scrollbar-thumb]:rounded-[3px]"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r text-white [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#666666] [&::-webkit-scrollbar-thumb]:rounded-[3px]"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0 text-white">
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Image 
                      src="/favicon.png"
                      alt="Logo"
                      width={36}
                      height={36}
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight text-white">
                    <span className="truncate font-semibold">Hyder</span>
                    <span className="truncate text-xs text-gray-300">Encrypted</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setShowCreateChat(true)}
                className="px-2.5 md:px-2"
              >
                <Plus className="h-5 w-5" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item)
                        const mail = data.chats.sort(() => Math.random() - 0.5)
                        setChats(
                          mail.slice(
                            0,
                            Math.max(5, Math.floor(Math.random() * 10) + 1)
                          )
                        )
                        setOpen(true)
                      }}
                      isActive={activeItem.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="space-y-2">
          <SidebarMenuItem className="[&::marker]:content-none">
            <SidebarMenuButton
              onClick={() => setShowKeys(true)}
              className="px-2.5 md:px-2"
            >
              <Key className="h-5 w-5" />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <NavUser />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-2 border-b p-3">
          <div className="flex w-full items-center justify-between">
            <div className="text-sm font-medium text-foreground">
              {activeItem.title}
            </div>
          </div>
          <SidebarInput placeholder="Search chats..." className="h-8" />
        </SidebarHeader>
        <SidebarContent className="pr-1">
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {chats.map((chat, index) => (
                <button
                  key={index}
                  onClick={() => setActiveChat(chat)}
                  className={`w-full flex items-start gap-2 border-b py-2 px-3 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                    activeChat?.publicKey === chat.publicKey ? 'bg-sidebar-accent' : ''
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-white text-sm">
                    {chat.isGroup ? 
                      <Users2 className="h-4 w-4" /> : 
                      chat.name.charAt(2)}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate text-xs">
                        {chat.name}
                        {chat.isGroup && <span className="text-[10px] ml-1 text-zinc-400">({chat.members})</span>}
                      </span>
                      <span className="text-[10px] text-zinc-400">{chat.date}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <span className="inline-flex items-center justify-center h-3.5 w-3.5 rounded-full bg-blue-600 text-[10px] font-medium">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <CreateChatDialog
        open={showCreateChat}
        onOpenChange={setShowCreateChat}
        onCreateChat={handleCreateChat}
      />
      <KeysDialog open={showKeys} onOpenChange={setShowKeys} />
    </Sidebar>
  )
}
