interface GroupMember {
  address: string
  publicKey: string
}

export class GroupChatService {
  private members: Map<string, GroupMember> = new Map()
  private connections: Map<string, ChatService> = new Map()

  constructor(groupId: string, members: GroupMember[]) {
    members.forEach(member => {
      this.members.set(member.address, member)
      if (member.address !== this.myAddress) {
        const connection = new ChatService(member.address)
        this.connections.set(member.address, connection)
      }
    })
  }

  async sendGroupMessage(content: string) {
    // Encrypt message for each member
    for (const [address, member] of this.members) {
      if (address === this.myAddress) continue

      const encryptedContent = await PGPService.encryptMessage(
        content,
        member.publicKey
      )

      const connection = this.connections.get(address)
      await connection?.sendMessage(address, encryptedContent)
    }
  }

  onGroupMessage(callback: (message: Message) => void) {
    this.connections.forEach(connection => {
      connection.onMessage((message) => {
        callback({
          ...message,
          isGroupMessage: true,
          groupId: this.groupId
        })
      })
    })
  }

  addMember(member: GroupMember) {
    this.members.set(member.address, member)
    if (member.address !== this.myAddress) {
      const connection = new ChatService(member.address)
      this.connections.set(member.address, connection)
    }
  }

  removeMember(address: string) {
    this.members.delete(address)
    this.connections.get(address)?.disconnect()
    this.connections.delete(address)
  }
} 