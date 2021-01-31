import { LoginController } from '@/presentation/controller/login/login-controller'
import { makeLoginValidation } from '../validation/login/login-validation'
import { makeDbAuthentication } from '@/main/factories/usecase'

export const makeLoginController = (): LoginController => {
  return new LoginController(makeDbAuthentication(), makeLoginValidation())
}
