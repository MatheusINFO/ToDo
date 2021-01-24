import { AddAccount } from '@/domain/usecases/add-account'

export interface AddAccountRepository {
  add (account: AddAccount.Params): Promise<AddAccount.Result>
}
