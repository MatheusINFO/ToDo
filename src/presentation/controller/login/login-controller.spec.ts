import faker from 'faker'
import { LoginController } from './login-controller'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { badRequest, serverError, success, unauthorized } from '@/presentation/helpers'
import { EmailValidator } from '@/presentation/protocols'
import { Authentication } from '@/domain/usecases'

let email: any, password: any, token: any

const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: Authentication.Params): Promise<string> {
      return token
    }
  }
  return new AuthenticationStub()
}

const mockEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

type SutTypes = {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthentication()
  const emailValidatorStub = mockEmailValidator()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub
  }
}

describe('', () => {
  beforeAll(() => {
    email = faker.internet.email()
    password = faker.internet.password()
    token = faker.random.uuid()
  })

  it('Should return 400 is no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 is no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('Should call EmailValidator with correct values', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        email,
        password
      }
    }
    await sut.handle(httpRequest)
    expect(emailValidatorSpy).toHaveBeenCalledWith(email)
  })

  it('Should return 400 if a invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        email,
        password
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should return 500 if EmailValidtor throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        email,
        password
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError())
  })

  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authenticationSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = {
      body: {
        email,
        password
      }
    }
    await sut.handle(httpRequest)
    expect(authenticationSpy).toHaveBeenCalledWith({ email, password })
  })

  it('Should return 401 if a invalid credentials provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(null)
    const httpRequest = {
      body: {
        email,
        password
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        email,
        password
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError())
  })

  it('Shoudl return 200 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email,
        password
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(success({ accessToken: token }))
  })
})
