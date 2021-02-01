import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, serverError, success } from '@/presentation/helpers'
import { MissingParamError } from '@/presentation/errors'
import { AddTodo } from '@/domain/usecases'

export class AddTodoController implements Controller {
  constructor (
    private readonly addTodo: AddTodo
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['title', 'description']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
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
