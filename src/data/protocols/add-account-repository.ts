import { AddAccount } from '@/domain/usecases/add-account'
import { AccountModel } from '@/domain/models/account'

export interface AddAccountRepository {
  add (account: AddAccount.Params): Promise<AccountModel>
}
