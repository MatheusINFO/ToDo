import { Router } from 'express'
import { adaptRoute } from '../adapter/express-router-adapter'
import { makeAddTodoController } from '../factories/todo'

export default (router: Router): void => {
  router.post('/todo', adaptRoute(makeAddTodoController()))
}
