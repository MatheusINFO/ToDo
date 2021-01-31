import { DbAddTodo } from '@/data/usecases'
import { TodoMongoRepository } from '@/infra/db'

export const makeDbAddTodo = (): DbAddTodo => {
  const addTodoRepository = new TodoMongoRepository()
  return new DbAddTodo(addTodoRepository)
}
