import bcrypt from 'bcrypt'
import { Encrypter, HashComparer } from '@/data/protocols'

export class BcryptAdapter implements Encrypter, HashComparer {
  constructor (
    private readonly salt: number
  ) {}

  async encrypt (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash)
    if (!isValid) {
      return false
    }
    return true
  }
}
