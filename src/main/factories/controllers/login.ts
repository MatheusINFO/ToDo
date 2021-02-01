import { LoginController } from '@/presentation/controller/login-controller'
import { makeLoginValidation } from '../validation/login-validation'
import { makeDbAuthentication } from '@/main/factories/usecase'

export const makeLoginController = (): LoginController => {
  return new LoginController(makeDbAuthentication(), makeLoginValidation())
}
