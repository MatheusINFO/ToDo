import { DbAddAccount } from '@/data/usecases'
import { BcryptAdapter } from '@/infra/cryptography'
import { AccountMongoRepository } from '@/infra/db'
import { SignUpController } from '@/presentation/controller/signup/signup-controller'
import { makeSignUpValidation } from '../validation/signup/signup-validation'

export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const encrypter = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(encrypter, addAccountRepository)
  return new SignUpController(dbAddAccount, makeSignUpValidation())
}
