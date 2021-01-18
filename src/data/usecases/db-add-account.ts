import { AddAccount } from '@/domain/usecases'
import { Encrypter } from '@/data/protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter
  ) {}

  async add (account: AddAccount.Params): Promise<AddAccount.Result> {
    await this.encrypter.encrypt(account.password)
    return null
  }
}
