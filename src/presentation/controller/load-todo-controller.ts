import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { serverError, success } from '@/presentation/helpers'
import { LoadTodo } from '@/domain/usecases'

export class LoadTodoController implements Controller {
  constructor (
    private readonly loadTodo: LoadTodo
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const todos = await this.loadTodo.loadAll(httpRequest.accountId)
      return success(todos)
    } catch (error) {
      return serverError()
    }
  }
}
