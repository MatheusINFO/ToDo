import faker from 'faker'
import { SignUpController } from './singup'
import { EmailValidator } from '@/presentation/protocols'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { badRequest, serverError, success } from '@/presentation/helpers'
import { AddAccount } from '@/domain/usecases'

let id: any, name: any, email: any, password: any, passwordConfirmation: any

const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccount.Params): Promise<AddAccount.Result> {
      const fakeAccount = {
        id,
        name,
        email,
        password
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
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
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount()
  const emailValidatorStub = mockEmailValidator()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  beforeEach(() => {
    id = faker.random.uuid()
    name = faker.name.findName()
    email = faker.internet.email()
    password = faker.internet.password()
    passwordConfirmation = password
  })

  it('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email,
        password,
        passwordConfirmation
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name,
        password,
        passwordConfirmation
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name,
        email,
        passwordConfirmation
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name,
        email,
        password
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  it('Should return 400 if passwordConfirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name,
        email,
        password,
        passwordConfirmation: faker.internet.password()
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  it('Should return 400 if a invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = {
      body: {
        name,
        email,
        password,
        passwordConfirmation
      }
    }
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should call EmailValidator with correct param', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = {
      body: {
        name,
        email,
        password,
        passwordConfirmation
      }
    }
    const emailValidator = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(httpRequest)
    expect(emailValidator).toHaveBeenCalledWith(email)
  })

  it('Should throw if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = {
      body: {
        name,
        email,
        password,
        passwordConfirmation
      }
    }
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError())
  })

  it('Should call AddAccount with correct param', async () => {
    const { sut, addAccountStub } = makeSut()
    const httpRequest = {
      body: {
        name,
        email,
        password,
        passwordConfirmation
      }
    }
    const addAccount = jest.spyOn(addAccountStub, 'add')
    await sut.handle(httpRequest)
    expect(addAccount).toHaveBeenCalledWith({
      name,
      email,
      password
    })
  })

  it('Should throw if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    const httpRequest = {
      body: {
        name,
        email,
        password,
        passwordConfirmation
      }
    }
    jest.spyOn(addAccountStub, 'add').mockImplementation(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError())
  })

  it('Should return an account on success', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name,
        email,
        password,
        passwordConfirmation
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(success({
      id,
      name,
      email,
      password
    }))
  })
})
