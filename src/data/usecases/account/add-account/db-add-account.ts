import { AddAccount } from '@/domain/usecases'
import { Encrypter , AddAccountRepository } from '@/data/protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (account: AddAccount.Params): Promise<AddAccount.Result> {
    const hashPassword = await this.encrypter.encrypt(account.password)
    const accountData = await this.addAccountRepository.add(Object.assign({}, account, { password: hashPassword }))
    return accountData
  }
}
