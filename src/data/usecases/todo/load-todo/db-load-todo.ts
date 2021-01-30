import { LoadTodoRepository } from '@/data/protocols'
import { LoadTodo } from '@/domain/usecases'

export class DbLoadTodo implements LoadTodoRepository {
  constructor (
    private readonly loadTodoRepository: LoadTodoRepository
  ) {}

  async loadAll (accountId: LoadTodo.Params): Promise<LoadTodo.Result> {
    const todos = await this.loadTodoRepository.loadAll(accountId)
    return todos
  }
}
