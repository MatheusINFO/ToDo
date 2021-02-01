import faker from 'faker'
import { forbidden, serverError, success } from '@/presentation/helpers'
import { AuthMiddleware } from '@/presentation/middlewares'
import { AccessDeniedError } from '@/presentation/errors'
import { LoadAccountByToken } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'

let id: any, name: any, email: any, password: any, token: any

const mockAccount = (): AccountModel => {
  return {
    id,
    name,
    email,
    password
  }
}

const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async loadByToken (acessToken: string): Promise<AccountModel> {
      return mockAccount()
    }
  }
  return new LoadAccountByTokenStub()
}

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Middleware Authentication', () => {
  beforeEach(() => {
    id = faker.random.uuid()
    name = faker.name.findName()
    email = faker.internet.email()
    password = faker.internet.password()
    token = faker.random.uuid()
  })

  it('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    await sut.handle({
      headers: {
        'x-access-token': token
      }
    })
    expect(loadSpy).toHaveBeenCalledWith(token)
  })

  it('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockReturnValueOnce(null)
    const httpResponse = await sut.handle({
      headers: {
        'x-access-token': token
      }
    })
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await sut.handle({
      headers: {
        'x-access-token': token
      }
    })
    expect(httpResponse).toEqual(serverError())
  })

  it('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      headers: {
        'x-access-token': token
      }
    })
    expect(httpResponse).toEqual(success({ accountId: id }))
  })
})
