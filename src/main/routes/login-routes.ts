import { Router } from 'express'
import { makeLoginController } from '@/main/factories/controllers/login'
import { adaptRoute } from '@/main/adapter/express-router-adapter'

export default (router: Router): void => {
  router.post('/login', adaptRoute(makeLoginController()))
}
