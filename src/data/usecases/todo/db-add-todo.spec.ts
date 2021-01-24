import faker from 'faker'
import { DbAddTodo } from './db-add-todo'
import { AddTodoRepository } from '@/data/protocols'
import { Todo } from '@/domain/models'
import { AddTodo } from '@/domain/usecases/add-todo'

let id: any, title: any, description: any, date: Date, active: boolean

const mockTodo = (): Todo => {
  return {
    id,
    title,
    description,
    date,
    active
  }
}

const mockAddTodoRepository = (): AddTodoRepository => {
  class AddTodoRepositoryStub implements AddTodoRepository {
    async add (todo: AddTodo.Params): Promise<AddTodo.Result> {
      return mockTodo()
    }
  }
  return new AddTodoRepositoryStub()
}

type SutTypes = {
  sut: DbAddTodo
  addTodoRepositoryStub: AddTodoRepository
}

const makeSut = (): SutTypes => {
  const addTodoRepositoryStub = mockAddTodoRepository()
  const sut = new DbAddTodo(addTodoRepositoryStub)
  return {
    sut,
    addTodoRepositoryStub
  }
}

describe('DbAddTodo Usecase', () => {
  beforeEach(() => {
    id = faker.random.uuid()
    title = faker.random.word()
    description = faker.random.words()
    date = faker.date.recent()
    active = faker.random.boolean()
  })

  it('Shoudl call AddTodoRepository with correct password', async () => {
    const { sut, addTodoRepositoryStub } = makeSut()
    const addTodoSpy = jest.spyOn(addTodoRepositoryStub, 'add')
    await sut.add({
      title,
      description,
      date,
      active
    })
    expect(addTodoSpy).toHaveBeenCalledWith({ title, description, date, active })
  })

  it('Shoudl throw if AddTodoRepository throws', async () => {
    const { sut, addTodoRepositoryStub } = makeSut()
    jest.spyOn(addTodoRepositoryStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = sut.add({
      title,
      description,
      date,
      active
    })
    await expect(httpResponse).rejects.toThrow()
  })

  it('Shoudl return an todo on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.add({
      title,
      description,
      date,
      active
    })
    expect(httpResponse).toEqual(mockTodo())
  })
})
