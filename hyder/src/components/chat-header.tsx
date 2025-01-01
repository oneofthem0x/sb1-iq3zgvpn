import { SendEthDialog } from "./send-eth-dialog"
import { PGPSetupDialog } from "./pgp-setup-dialog"

export function ChatHeader() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-zinc-800">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-white">Chat</h2>
      </div>
      <div className="flex items-center gap-2">
        <PGPSetupDialog />
        <SendEthDialog />
      </div>
    </div>
  )
} 