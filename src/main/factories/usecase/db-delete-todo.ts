import { DbDeleteTodo } from '@/data/usecases'
import { TodoMongoRepository } from '@/infra/db'

export const makeDbDeleteTodo = (): DbDeleteTodo => {
  const deleteTodoRepository = new TodoMongoRepository()
  return new DbDeleteTodo(deleteTodoRepository)
}
