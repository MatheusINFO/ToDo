import { DbLoadTodo } from '@/data/usecases'
import { TodoMongoRepository } from '@/infra/db'

export const makeDbLoadTodo = (): DbLoadTodo => {
  const loadTodoRepository = new TodoMongoRepository()
  return new DbLoadTodo(loadTodoRepository)
}
