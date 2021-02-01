import faker from 'faker'
import { DeleteTodoRepository } from '@/data/protocols/delete-todo-repository'
import { DbDeleteTodo } from '@/data/usecases'
import { DeleteTodo } from '@/domain/usecases/delete-todo'
import { Todo } from '@/domain/models'

let id: any, accountId: any, title: any, description: any, date: Date, active: boolean

const mockTodo = (): Todo => {
  return {
    id,
    accountId,
    title,
    description,
    date,
    active
  }
}

const mockDeleteTodoRepository = (): DeleteTodoRepository => {
  class DeleteTodoRepositoryStub implements DeleteTodoRepository {
    async delete (id: DeleteTodo.Params): Promise<DeleteTodo.Result> {
      return mockTodo()
    }
  }
  return new DeleteTodoRepositoryStub()
}

type SutTypes = {
  sut: DbDeleteTodo
  deleteTodoRepositoryStub: DeleteTodoRepository
}

const makeSut = (): SutTypes => {
  const deleteTodoRepositoryStub = mockDeleteTodoRepository()
  const sut = new DbDeleteTodo(deleteTodoRepositoryStub)
  return {
    sut,
    deleteTodoRepositoryStub
  }
}

describe('DbDeleteTodo Usecase', () => {
  beforeEach(() => {
    id = faker.random.uuid()
    accountId = faker.random.uuid()
    title = faker.random.word()
    description = faker.random.words()
    date = faker.date.recent()
    active = faker.random.boolean()
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

  it('Should return a todo on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.delete(id)
    expect(httpResponse).toEqual(mockTodo())
  })
})
