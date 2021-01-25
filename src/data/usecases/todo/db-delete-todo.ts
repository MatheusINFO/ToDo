import { LoadTodoByIdRepository } from '@/data/protocols'
import { DeleteTodoRepository } from '@/data/protocols/delete-todo-repository'
import { DeleteTodo } from '@/domain/usecases/delete-todo'

export class DbDeleteTodo implements DeleteTodoRepository {
  constructor (
    private readonly loadTodoByIdRepository: LoadTodoByIdRepository,
    private readonly deleteTodoRepository: DeleteTodoRepository
  ) {}

  async delete (id: DeleteTodo.Params): Promise<DeleteTodo.Result> {
    const todo = await this.loadTodoByIdRepository.loadById(id)
    if (todo) {
      const deletedTodo = await this.deleteTodoRepository.delete(id)
      return deletedTodo
    }
    return null
  }
}
