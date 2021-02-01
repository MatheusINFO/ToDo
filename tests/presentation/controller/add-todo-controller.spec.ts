import faker from 'faker'
import MockDate from 'mockdate'
import { badRequest, serverError, success, Validation } from '@/presentation/helpers'
import { AddTodoController } from '@/presentation/controller'
import { AddTodo } from '@/domain/usecases'
import { mockValidation } from '@/tests/presentation/mocks'

let id: any, accountId: any, title: any, description: any

const mockAddTodo = (): AddTodo => {
  class AddTodoStub implements AddTodo {
    async add (todo: AddTodo.Params): Promise<AddTodo.Result> {
      return {
        id,
        accountId,
        title,
        description,
        date: new Date(),
        active: false
      }
    }
  }
  return new AddTodoStub()
}

type SutTypes = {
  sut: AddTodoController
  addTodoStub: AddTodo
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addTodoStub = mockAddTodo()
  const sut = new AddTodoController(addTodoStub, validationStub)
  return {
    sut,
    addTodoStub,
    validationStub
  }
}

describe('Add Todo Controller', () => {
  beforeEach(async () => {
    id = faker.random.uuid()
    accountId = faker.random.uuid()
    title = faker.random.word()
    description = faker.random.words()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Shoudl call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = {
      body: {
        title,
        description
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
        title,
        description
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  it('Should call AddTodo with correct values', async () => {
    const { sut, addTodoStub } = makeSut()
    const addTodoSpy = jest.spyOn(addTodoStub, 'add')
    const httpRequest = {
      body: {
        title,
        description
      }
    }
    await sut.handle(httpRequest)
    expect(addTodoSpy).toBeCalledWith({ title, description, date: new Date(), active: true })
  })

  it('Should throw if AddTodo throws', async () => {
    const { sut, addTodoStub } = makeSut()
    jest.spyOn(addTodoStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        title,
        description
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError())
  })

  it('Should return an todo on success', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        title,
        description
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(success({
      id,
      accountId,
      title,
      description,
      date: new Date(),
      active: false
    }))
  })
})
