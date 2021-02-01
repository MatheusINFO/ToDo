import { AddTodoRepository } from '@/data/protocols'
import { AddTodo } from '@/domain/usecases/add-todo'

export class DbAddTodo implements AddTodoRepository {
  constructor (
    private readonly addTodoRepository: AddTodoRepository
  ) {}

  async add (todo: AddTodo.Params): Promise<AddTodo.Result> {
    const newTodo = await this.addTodoRepository.add(todo)
    return newTodo
  }
}
