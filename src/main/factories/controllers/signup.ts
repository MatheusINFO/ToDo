import { SignUpController } from '@/presentation/controller/signup/signup-controller'
import { makeDbAddAccount } from '../usecase'
import { makeSignUpValidation } from '../validation/signup/signup-validation'

export const makeSignUpController = (): SignUpController => {
  return new SignUpController(makeDbAddAccount(), makeSignUpValidation())
}
