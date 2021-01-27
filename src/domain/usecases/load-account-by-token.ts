import { AccountModel } from '../models'

export interface LoadAccountByToken {
  loadByToken (acessToken: string): Promise<AccountModel>
}
