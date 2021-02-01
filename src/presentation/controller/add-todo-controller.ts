import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, serverError, success, Validation } from '@/presentation/helpers'
import { AddTodo } from '@/domain/usecases'

export class AddTodoController implements Controller {
  constructor (
    private readonly addTodo: AddTodo,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { title, description } = httpRequest.body
      const accountId = httpRequest.accountId
      const data = await this.addTodo.add({
        accountId,
        title,
        description,
        date: new Date(),
        active: true
      })
      return success(data)
    } catch (error) {
      return serverError()
    }
  }
}
