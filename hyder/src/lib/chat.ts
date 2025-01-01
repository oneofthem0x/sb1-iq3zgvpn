import { PGPService } from './pgp'

interface Message {
  id: string
  from: string
  to: string
  content: string
  timestamp: number
  encrypted: boolean
}

interface QueuedMessage {
  to: string
  content: string
  timestamp: number
}

export class ChatService {
  private peerConnection: RTCPeerConnection
  private dataChannel: RTCDataChannel | null = null
  private messageCallbacks: ((message: Message) => void)[] = []
  private statusCallbacks: ((messageId: string, status: Message['status']) => void)[] = []
  private isTyping = false
  private typingTimeout: NodeJS.Timeout | null = null
  private typingCallbacks: ((isTyping: boolean) => void)[] = []
  private messageQueue: QueuedMessage[] = []
  private isOnline = false

  constructor(targetAddress: string) {
    // Initialize WebRTC peer connection
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    })

    // Set up data channel
    this.dataChannel = this.peerConnection.createDataChannel('chat')
    this.setupDataChannel()

    // Load queued messages from storage
    const queued = localStorage.getItem(`message-queue-${targetAddress}`)
    if (queued) {
      this.messageQueue = JSON.parse(queued)
    }

    this.peerConnection.onconnectionstatechange = () => {
      this.isOnline = this.peerConnection.connectionState === 'connected'
      if (this.isOnline) {
        this.processMessageQueue()
      }
    }
  }

  private setupDataChannel() {
    if (!this.dataChannel) return

    this.dataChannel.onmessage = async (event) => {
      const data = JSON.parse(event.data)

      if (data.type === 'message') {
        const message = data.message
        
        // Send delivery confirmation
        this.dataChannel.send(JSON.stringify({
          type: 'delivery-receipt',
          messageId: message.id
        }))

        // Decrypt and process message
        if (message.encrypted) {
          const privateKey = localStorage.getItem('pgp-private-key')
          if (privateKey) {
            message.content = await PGPService.decryptMessage(
              message.content,
              privateKey
            )
          }
        }

        this.saveMessageToHistory(message)
        this.messageCallbacks.forEach(cb => cb(message))
      }

      else if (data.type === 'delivery-receipt') {
        this.statusCallbacks.forEach(cb => 
          cb(data.messageId, 'delivered')
        )
      }

      else if (data.type === 'read-receipt') {
        this.statusCallbacks.forEach(cb => 
          cb(data.messageId, 'read')
        )
      }

      // Add typing indicator handling
      else if (data.type === 'typing') {
        this.typingCallbacks.forEach(cb => cb(data.isTyping))
      }
    }
  }

  private saveMessageToHistory(message: Message) {
    const history = this.getMessageHistory()
    history.push(message)
    localStorage.setItem(`chat-history-${message.from}-${message.to}`, JSON.stringify(history))
  }

  getMessageHistory(): Message[] {
    const history = localStorage.getItem(`chat-history-${this.peerConnection.localDescription?.sdp}`)
    return history ? JSON.parse(history) : []
  }

  onMessage(callback: (message: Message) => void) {
    this.messageCallbacks.push(callback)
  }

  onStatusUpdate(callback: (messageId: string, status: Message['status']) => void) {
    this.statusCallbacks.push(callback)
  }

  async sendMessage(to: string, content: string) {
    if (!this.isOnline) {
      this.messageQueue.push({ to, content, timestamp: Date.now() })
      localStorage.setItem(`message-queue-${this.targetAddress}`, JSON.stringify(this.messageQueue))
      return
    }

    if (!this.dataChannel) return

    // Encrypt message with recipient's public key
    const recipientPublicKey = await this.getPublicKey(to) // You'll need to implement this
    const encryptedContent = await PGPService.encryptMessage(content, recipientPublicKey)

    const message: Message = {
      id: crypto.randomUUID(),
      from: this.peerConnection.localDescription?.sdp || '',
      to,
      content: encryptedContent,
      timestamp: Date.now(),
      encrypted: true
    }

    // Send with message wrapper
    this.dataChannel.send(JSON.stringify({
      type: 'message',
      message
    }))

    // Store locally
    this.saveMessageToHistory(message)

    return message.id
  }

  markAsRead(messageId: string) {
    this.dataChannel?.send(JSON.stringify({
      type: 'read-receipt',
      messageId
    }))
  }

  disconnect() {
    this.dataChannel?.close()
    this.peerConnection.close()
  }

  onTyping(callback: (isTyping: boolean) => void) {
    this.typingCallbacks.push(callback)
  }

  setTyping(isTyping: boolean) {
    if (this.isTyping !== isTyping) {
      this.isTyping = isTyping
      this.dataChannel?.send(JSON.stringify({
        type: 'typing',
        isTyping
      }))

      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout)
      }

      if (isTyping) {
        this.typingTimeout = setTimeout(() => {
          this.setTyping(false)
        }, 3000)
      }
    }
  }

  private async processMessageQueue() {
    while (this.messageQueue.length > 0 && this.isOnline) {
      const msg = this.messageQueue.shift()
      if (msg) {
        await this.sendMessage(msg.to, msg.content)
      }
    }
    localStorage.setItem(`message-queue-${this.targetAddress}`, JSON.stringify(this.messageQueue))
  }
} 