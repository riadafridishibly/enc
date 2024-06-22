export type EncryptedResult = {
  error?: string
  data?: string
}

export type DecryptedResult = {
  error?: string
  data?: string
}

export type GenerateKeysResult = {
  error?: string
  publicKey?: string
  privateKey?: string
}

export type VerifyPublicKeyResult = {
  error?: string
  publicKey?: string
}

declare global {
  interface Window {
    Hello(): string
    ToUpper(s: string): string
    Encrypt(message: string, pubKey: string[]): EncryptedResult
    Decrypt(message: string, privKey: string[]): DecryptedResult
    GenerateKeys(): GenerateKeysResult
    VerifyPublicKey(pubKey: string): VerifyPublicKeyResult
  }
}
