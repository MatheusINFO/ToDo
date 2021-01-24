import { Router } from 'express'
import { adaptRoute } from '@/main/adapter/express-router-adapter'
import { makeSignUpController } from '@/main/factories/signup'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
}
