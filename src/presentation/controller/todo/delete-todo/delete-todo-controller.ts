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
      const { id } = httpRequest.body
      if (!id) {
        return badRequest(new MissingParamError('id'))
      }
      const deleteTodo = await this.deleteTodo.delete(id)
      return success(deleteTodo)
    } catch (error) {
      return serverError()
    }
  }
}
