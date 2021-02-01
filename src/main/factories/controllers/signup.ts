import { SignUpController } from '@/presentation/controller/signup-controller'
import { makeDbAddAccount } from '../usecase'
import { makeSignUpValidation } from '../validation/signup-validation'

export const makeSignUpController = (): SignUpController => {
  return new SignUpController(makeDbAddAccount(), makeSignUpValidation())
}
