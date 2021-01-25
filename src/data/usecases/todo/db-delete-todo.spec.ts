import faker from 'faker'
import { DbDeleteTodo } from './db-delete-todo'
import { Todo } from '@/domain/models'
import { LoadTodoByIdRepository } from '@/data/protocols'
import { DeleteTodoRepository } from '@/data/protocols/delete-todo-repository'
import { DeleteTodo } from '@/domain/usecases/delete-todo'

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

const mockDeleteTodoRepository = (): DeleteTodoRepository => {
  class DeleteTodoRepositoryStub implements DeleteTodoRepository {
    async delete (id: DeleteTodo.Params): Promise<void> {}
  }
  return new DeleteTodoRepositoryStub()
}

const mockLoadTodoByIdRepository = (): LoadTodoByIdRepository => {
  class LoadTodoByIdRepositoryStub implements LoadTodoByIdRepository {
    async loadById (id: string): Promise<Todo> {
      return mockTodo()
    }
  }
  return new LoadTodoByIdRepositoryStub()
}

type SutTypes = {
  sut: DbDeleteTodo
  loadTodoByIdRepositoryStub: LoadTodoByIdRepository
  deleteTodoRepositoryStub: DeleteTodoRepository
}

const makeSut = (): SutTypes => {
  const deleteTodoRepositoryStub = mockDeleteTodoRepository()
  const loadTodoByIdRepositoryStub = mockLoadTodoByIdRepository()
  const sut = new DbDeleteTodo(loadTodoByIdRepositoryStub, deleteTodoRepositoryStub)
  return {
    sut,
    loadTodoByIdRepositoryStub,
    deleteTodoRepositoryStub
  }
}

describe('DbDeleteTodo Usecase', () => {
  beforeEach(() => {
    id = faker.random.uuid()
    title = faker.random.word()
    description = faker.random.words()
    date = faker.date.recent()
    active = faker.random.boolean()
  })

  it('Should call LoadTodoByIdRepository with correct values', async () => {
    const { sut, loadTodoByIdRepositoryStub } = makeSut()
    const loadTodoSpy = jest.spyOn(loadTodoByIdRepositoryStub, 'loadById')
    await sut.delete(id)
    expect(loadTodoSpy).toHaveBeenCalledWith(id)
  })

  it('Should throw if LoadTodoByIdRepository throws', async () => {
    const { sut, loadTodoByIdRepositoryStub } = makeSut()
    jest.spyOn(loadTodoByIdRepositoryStub, 'loadById').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = sut.delete(id)
    await expect(httpResponse).rejects.toThrow()
  })

  it('Should return null if LoadTodoByIdRepository with returns null', async () => {
    const { sut, loadTodoByIdRepositoryStub } = makeSut()
    jest.spyOn(loadTodoByIdRepositoryStub, 'loadById').mockReturnValueOnce(null)
    const httpResponse = await sut.delete(id)
    expect(httpResponse).toBeNull()
  })

  it('Should call DeleteTodoRepository with correct values', async () => {
    const { sut, deleteTodoRepositoryStub } = makeSut()
    const deleteTodoSpy = jest.spyOn(deleteTodoRepositoryStub, 'delete')
    await sut.delete(id)
    expect(deleteTodoSpy).toHaveBeenCalledWith(id)
  })

  it('Should throw if DeleteTodoRepository throws', async () => {
    const { sut, deleteTodoRepositoryStub } = makeSut()
    jest.spyOn(deleteTodoRepositoryStub, 'delete').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = sut.delete(id)
    await expect(httpResponse).rejects.toThrow()
  })
})
