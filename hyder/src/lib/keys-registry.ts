interface PublicKeyEntry {
  address: string;  // Ethereum address
  publicKey: string;
  timestamp: number;
}

export class KeysRegistry {
  // When a user generates/updates their keys
  static async registerPublicKey(address: string, publicKey: string) {
    try {
      const response = await fetch('/api/keys/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          publicKey,
          timestamp: Date.now()
        })
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to register public key:', error);
      return false;
    }
  }

  // When starting a new chat
  static async lookupPublicKey(address: string): Promise<string | null> {
    try {
      const response = await fetch(`/api/keys/lookup/${address}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.publicKey;
    } catch (error) {
      console.error('Failed to lookup public key:', error);
      return null;
    }
  }
} 