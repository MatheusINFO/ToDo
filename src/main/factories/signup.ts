import { DbAddAccount } from '@/data/usecases'
import { BcryptAdapter } from '@/infra/cryptography'
import { AccountMongoRepository } from '@/infra/db'
import { EmailValidatorAdapter } from '@/infra/validators'
import { SignUpController } from '@/presentation/controller/singup'

export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const encrypter = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const emailValidator = new EmailValidatorAdapter()
  const dbAddAccount = new DbAddAccount(encrypter, addAccountRepository)
  return new SignUpController(emailValidator, dbAddAccount)
}
