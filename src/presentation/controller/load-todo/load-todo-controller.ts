import { LoadTodo } from '@/domain/usecases'
import { serverError, success } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoadTodoController implements Controller {
  constructor (
    private readonly loadTodo: LoadTodo
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const todos = await this.loadTodo.loadAll()
      return success(todos)
    } catch (error) {
      return serverError()
    }
  }
}
