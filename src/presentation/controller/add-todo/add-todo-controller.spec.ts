import faker from 'faker'
import MockDate from 'mockdate'
import { AddTodoController } from './add-todo-controller'
import { AddTodo } from '@/domain/usecases'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, serverError, success } from '@/presentation/helpers'

let id: any, title: any, description: any

const mockAddTodo = (): AddTodo => {
  class AddTodoStub implements AddTodo {
    async add (todo: AddTodo.Params): Promise<AddTodo.Result> {
      return {
        id,
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
}

const makeSut = (): SutTypes => {
  const addTodoStub = mockAddTodo()
  const sut = new AddTodoController(addTodoStub)
  return {
    sut,
    addTodoStub
  }
}

describe('Add Todo Controller', () => {
  beforeEach(async () => {
    id = faker.random.uuid()
    title = faker.random.word()
    description = faker.random.words()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should return 400 if no title is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        description
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('title')))
  })

  it('Should return 400 if no description is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        title
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('description')))
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
      title,
      description,
      date: new Date(),
      active: false
    }))
  })
})
