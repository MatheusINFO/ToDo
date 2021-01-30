import faker from 'faker'
import { LoadTodoController } from './load-todo-controller'
import { LoadTodo } from '@/domain/usecases'
import { Todo } from '@/domain/models'
import { serverError, success } from '@/presentation/helpers'

let id: any, accountId: any, title: any, description: any, date: Date, active: boolean

const mockListTodo = (): Todo[] => {
  return [{
    id,
    accountId,
    title,
    description,
    date,
    active
  }]
}

const mockLoadTodo = (): LoadTodo => {
  class LoadTodoStub implements LoadTodo {
    async loadAll (): Promise<LoadTodo.Result> {
      return mockListTodo()
    }
  }
  return new LoadTodoStub()
}

type SutTypes = {
  sut: LoadTodoController
  loadTodoStub: LoadTodo
}

const makeSut = (): SutTypes => {
  const loadTodoStub = mockLoadTodo()
  const sut = new LoadTodoController(loadTodoStub)
  return {
    sut,
    loadTodoStub
  }
}

describe('Load Todo Controller', () => {
  beforeEach(() => {
    id = faker.random.uuid()
    accountId = faker.random.uuid()
    title = faker.random.word()
    description = faker.random.words()
    date = faker.date.recent()
    active = faker.random.boolean()
  })

  it('Should call LoadTodo', async () => {
    const { sut, loadTodoStub } = makeSut()
    const loadTodoSpy = jest.spyOn(loadTodoStub, 'loadAll')
    await sut.handle({})
    expect(loadTodoSpy).toHaveBeenCalled()
  })

  it('Should return a empty array if Load todo is empty', async () => {
    const { sut, loadTodoStub } = makeSut()
    jest.spyOn(loadTodoStub, 'loadAll').mockReturnValueOnce(new Promise(resolve => resolve([])))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(success([]))
  })

  it('Should throw if LoadTodo throws', async () => {
    const { sut, loadTodoStub } = makeSut()
    jest.spyOn(loadTodoStub, 'loadAll').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError())
  })

  it('Should all todos on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(success(mockListTodo()))
  })
})
