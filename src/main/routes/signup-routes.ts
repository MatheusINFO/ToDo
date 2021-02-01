import { Router } from 'express'
import { makeSignUpController } from '@/main/factories/controllers/signup'
import { adaptRoute } from '@/main/adapter/express-router-adapter'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
}
