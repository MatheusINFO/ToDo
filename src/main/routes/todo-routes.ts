import { Router } from 'express'
import { adaptRoute } from '@/main/adapter/express-router-adapter'
import { makeAddTodoController } from '@/main/factories/todo'

export default (router: Router): void => {
  router.post('/todo', adaptRoute(makeAddTodoController()))
}
