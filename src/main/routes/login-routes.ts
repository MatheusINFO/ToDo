import { Router } from 'express'
import { adaptRoute } from '@/main/adapter/express-router-adapter'
import { makeLoginController } from '@/main/factories/controllers/login'

export default (router: Router): void => {
  router.post('/login', adaptRoute(makeLoginController()))
}
