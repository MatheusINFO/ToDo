import jwt from 'jsonwebtoken'
import { Decrypter, TokenGenerator } from '@/data/protocols'

export class JwtAdapter implements TokenGenerator, Decrypter {
  constructor (
    private readonly secret
  ) {}

  async generate (id: string): Promise<string> {
    const accessToken = await jwt.sign({ id }, this.secret)
    return accessToken
  }

  async decrypt (value: string): Promise<string> {
    const access: any = await jwt.verify(value, this.secret)
    return access
  }
}
