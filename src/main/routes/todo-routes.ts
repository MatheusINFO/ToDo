import { Router } from 'express'
import { adaptRoute } from '@/main/adapter/express-router-adapter'
import { makeAddTodoController } from '@/main/factories/add-todo'
import { makeLoadTodoController } from '@/main/factories/load-todo'
import { makeDeleteTodoController } from '@/main/factories/delete-todo'
import { adaptMiddleware } from '@/main/adapter/express-middleware-adapter'
import { makeAuthMiddleware } from '@/main/middlewares/auth'

export default (router: Router): void => {
  const auth = adaptMiddleware(makeAuthMiddleware())
  router.post('/todo', auth, adaptRoute(makeAddTodoController()))
  router.get('/todo', auth, adaptRoute(makeLoadTodoController()))
  router.delete('/todo', auth, adaptRoute(makeDeleteTodoController()))
}
