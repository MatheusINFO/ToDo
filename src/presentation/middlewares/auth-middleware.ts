import { LoadAccountByToken } from '@/domain/usecases'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, serverError, success } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class AuthMiddleware implements Controller {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.loadByToken(accessToken)
        if (account) {
          return success({
            accountId: account.id
          })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError()
    }
  }
}
