import { DeleteTodoRepository } from '@/data/protocols/delete-todo-repository'
import { DeleteTodo } from '@/domain/usecases/delete-todo'

export class DbDeleteTodo implements DeleteTodoRepository {
  constructor (
    private readonly deleteTodoRepository: DeleteTodoRepository
  ) {}

  async delete (id: DeleteTodo.Params): Promise<DeleteTodo.Result> {
    const deletedTodo = await this.deleteTodoRepository.delete(id)
    return deletedTodo
  }
}
