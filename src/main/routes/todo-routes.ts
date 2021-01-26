import { Router } from 'express'
import { adaptRoute } from '@/main/adapter/express-router-adapter'
import { makeAddTodoController } from '@/main/factories/add-todo'
import { makeLoadTodoController } from '../factories/load-todo'
import { makeDeleteTodoController } from '../factories/delete-todo'

export default (router: Router): void => {
  router.post('/todo', adaptRoute(makeAddTodoController()))
  router.get('/todo', adaptRoute(makeLoadTodoController()))
  router.delete('/todo', adaptRoute(makeDeleteTodoController()))
}
