import { LoadTodoByIdRepository } from '@/data/protocols'
import { DeleteTodoRepository } from '@/data/protocols/delete-todo-repository'
import { DeleteTodo } from '@/domain/usecases/delete-todo'

export class DbDeleteTodo implements DeleteTodoRepository {
  constructor (
    private readonly loadTodoByIdRepository: LoadTodoByIdRepository,
    private readonly deleteTodoRepository: DeleteTodoRepository
  ) {}

  async delete (id: DeleteTodo.Params): Promise<void> {
    const todo = await this.loadTodoByIdRepository.loadById(id)
    if (todo) {
      await this.deleteTodoRepository.delete(id)
    }
    return null
  }
}
