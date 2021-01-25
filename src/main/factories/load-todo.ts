import { DbLoadTodo } from '@/data/usecases'
import { TodoMongoRepository } from '@/infra/db'
import { LoadTodoController } from '@/presentation/controller/load-todo/load-todo-controller'

export const makeLoadTodoController = (): LoadTodoController => {
  const loadTodoRepository = new TodoMongoRepository()
  const dbLoadTodo = new DbLoadTodo(loadTodoRepository)
  return new LoadTodoController(dbLoadTodo)
}
