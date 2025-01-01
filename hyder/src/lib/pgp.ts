import * as openpgp from 'openpgp'

export class PGPService {
  static async generateKeyPair(name: string, email: string) {
    const { privateKey, publicKey } = await openpgp.generateKey({
      type: 'ecc',
      curve: 'curve25519',
      userIDs: [{ name, email }],
      format: 'armored'
    })

    return {
      privateKey,
      publicKey
    }
  }

  static async encryptMessage(message: string, recipientPublicKey: string) {
    const encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: message }),
      encryptionKeys: await openpgp.readKey({ armoredKey: recipientPublicKey })
    })

    return encrypted
  }

  static async decryptMessage(encryptedMessage: string, privateKey: string) {
    const message = await openpgp.readMessage({
      armoredMessage: encryptedMessage
    })

    const { data: decrypted } = await openpgp.decrypt({
      message,
      decryptionKeys: await openpgp.readPrivateKey({ armoredKey: privateKey })
    })

    return decrypted
  }

  static async storeKeys(publicKey: string, privateKey: string) {
    localStorage.setItem('pgp_public_key', publicKey)
    localStorage.setItem('pgp_private_key', privateKey)
  }

  static getStoredKeys() {
    const publicKey = localStorage.getItem('pgp_public_key')
    const privateKey = localStorage.getItem('pgp_private_key')
    return { publicKey, privateKey }
  }

  static hasKeys() {
    const { publicKey, privateKey } = this.getStoredKeys()
    return !!(publicKey && privateKey)
  }

  static async validatePublicKey(publicKey: string) {
    try {
      await openpgp.readKey({ armoredKey: publicKey })
      return true
    } catch (error) {
      throw new Error('Invalid public key format')
    }
  }
} 