import { Router } from 'express'
import { makeLoadTodoController } from '@/main/factories/controllers/load-todo'
import { makeAddTodoController } from '@/main/factories/controllers/add-todo'
import { adaptMiddleware } from '@/main/adapter/express-middleware-adapter'
import { makeDeleteTodo } from '@/main/factories/controllers/delete-todo'
import { makeAuthMiddleware } from '@/main/factories/middleware/auth'
import { adaptRoute } from '@/main/adapter/express-router-adapter'

export default (router: Router): void => {
  const auth = adaptMiddleware(makeAuthMiddleware())
  router.post('/todo', auth, adaptRoute(makeAddTodoController()))
  router.get('/todo', auth, adaptRoute(makeLoadTodoController()))
  router.delete('/todo', auth, adaptRoute(makeDeleteTodo()))
}
