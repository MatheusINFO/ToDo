import faker from 'faker'
import { badRequest, serverError, success, Validation } from '@/presentation/helpers'
import { SignUpController } from '@/presentation/controller'
import { mockValidation } from '@/tests/presentation/mocks'
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

type SutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addAccountStub = mockAddAccount()
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
    validationStub
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

  it('Shoudl call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = {
      body: {
        name,
        email,
        password,
        passwordConfirmation
      }
    }
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Shoudl return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpRequest = {
      body: {
        name,
        email,
        password,
        passwordConfirmation
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
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
