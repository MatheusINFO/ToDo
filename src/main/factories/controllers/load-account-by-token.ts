import { LoadAccountByToken } from '@/domain/usecases'
import { makeLoadAccountByToken } from '@/main/factories/usecase'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  return makeLoadAccountByToken()
}
