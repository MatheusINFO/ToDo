import { DbDeleteTodo } from '@/data/usecases'
import { TodoMongoRepository } from '@/infra/db'
import { DeleteTodoController } from '@/presentation/controller/delete-todo/delete-todo-controller'

export const makeDeleteTodoController = (): DeleteTodoController => {
  const deleteTodoRepository = new TodoMongoRepository()
  const dbDeleteTodo = new DbDeleteTodo(deleteTodoRepository)
  return new DeleteTodoController(dbDeleteTodo)
}
