"use client"

import { Separator } from "@/components/ui/separator"
import { AccountSwitcher } from "./account-switcher"
import { ChatSidebar } from "./chat-sidebar"
import { ChatMain } from "./chat-main"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export function ChatDashboard() {
  return (
    <div className="flex h-screen w-full bg-background dark">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <div className="flex h-full flex-col">
            <AccountSwitcher />
            <Separator />
            <ChatSidebar />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={80}>
          <div className="flex h-full">
            <ChatMain />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
