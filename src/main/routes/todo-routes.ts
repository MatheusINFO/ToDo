import { Router } from 'express'
import { adaptRoute } from '@/main/adapter/express-router-adapter'
import { makeAddTodoController } from '@/main/factories/add-todo'
import { makeLoadTodoController } from '../factories/load-todo'
import { makeDeleteTodoController } from '../factories/delete-todo'
import { adaptMiddleware } from '../adapter/express-middleware-adapter'
import { makeAuthMiddleware } from '../middlewares/auth'

export default (router: Router): void => {
  const auth = adaptMiddleware(makeAuthMiddleware())
  router.post('/todo', auth, adaptRoute(makeAddTodoController()))
  router.get('/todo', auth, adaptRoute(makeLoadTodoController()))
  router.delete('/todo', auth, adaptRoute(makeDeleteTodoController()))
}
