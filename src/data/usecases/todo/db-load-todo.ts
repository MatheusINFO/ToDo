import { LoadTodoRepository } from '@/data/protocols'
import { LoadTodo } from '@/domain/usecases'

export class DbLoadTodo implements LoadTodoRepository {
  constructor (
    private readonly loadTodoRepository: LoadTodoRepository
  ) {}

  async loadAll (): Promise<LoadTodo.Result> {
    const todos = await this.loadTodoRepository.loadAll()
    return todos
  }
}
