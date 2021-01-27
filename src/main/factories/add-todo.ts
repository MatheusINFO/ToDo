import { DbAddTodo } from '@/data/usecases'
import { TodoMongoRepository } from '@/infra/db'
import { AddTodoController } from '@/presentation/controller/todo/add-todo/add-todo-controller'

export const makeAddTodoController = (): AddTodoController => {
  const addTodoRepository = new TodoMongoRepository()
  const dbAddTodo = new DbAddTodo(addTodoRepository)
  return new AddTodoController(dbAddTodo)
}
