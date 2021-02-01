import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, serverError, success, Validation } from '@/presentation/helpers'
import { DeleteTodo } from '@/domain/usecases'

export class DeleteTodoController implements Controller {
  constructor (
    private readonly deleteTodo: DeleteTodo,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { id } = httpRequest.body
      const deleteTodo = await this.deleteTodo.delete(id)
      return success(deleteTodo)
    } catch (error) {
      return serverError()
    }
  }
}
