import { Decrypter, LoadAccountByTokenRepository } from '@/data/protocols'
import { AccountModel } from '@/domain/models'

export class DbLoadAccountByToken implements LoadAccountByTokenRepository {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async loadByToken (token: string): Promise<AccountModel> {
    const accountToken = await this.decrypter.decrypt(token)
    if (accountToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken(token)
      if (account) {
        return account
      }
    }
    return null
  }
}
