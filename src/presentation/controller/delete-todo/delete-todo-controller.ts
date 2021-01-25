import { DeleteTodo } from '@/domain/usecases'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, serverError, success } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class DeleteTodoController implements Controller {
  constructor (
    private readonly deleteTodo: DeleteTodo
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.body.id) {
        return badRequest(new MissingParamError('id'))
      }
      const deleteTodo = await this.deleteTodo.delete(httpRequest.body.id)
      return success(deleteTodo)
    } catch (error) {
      return serverError()
    }
  }
}
