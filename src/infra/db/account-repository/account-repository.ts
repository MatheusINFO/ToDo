import { AddAccountRepository } from '@/data/protocols'
import { AccountModel } from '@/domain/models'
import { AddAccount } from '@/domain/usecases'
import { MongoHelper } from '@/infra/db'

export class AccountMongoRepository implements AddAccountRepository {
  async add (account: AddAccount.Params): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(account)
    const accountData = result.ops[0]
    return MongoHelper.map(accountData)
  }
}
