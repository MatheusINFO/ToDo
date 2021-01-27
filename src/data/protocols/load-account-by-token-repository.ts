import { AccountModel } from '@/domain/models'

export interface LoadAccountByTokenRepository {
  loadByToken (token: string): Promise<AccountModel>
}
