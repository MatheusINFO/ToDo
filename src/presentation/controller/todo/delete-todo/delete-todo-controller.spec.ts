import faker from 'faker'
import { DeleteTodoController } from './delete-todo-controller'
import { DeleteTodo } from '@/domain/usecases'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, serverError, success } from '@/presentation/helpers'
import { Todo } from '@/domain/models'

let accountId: any, id: any, title: any, description: any, date: Date, active: boolean

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

const mockDeleteTodo = (): DeleteTodo => {
  class DeleteTodoStub implements DeleteTodo {
    async delete (id: DeleteTodo.Params): Promise<DeleteTodo.Result> {
      return mockTodo()
    }
  }
  return new DeleteTodoStub()
}

type SutTypes = {
  sut: DeleteTodoController
  deleteTodoStub: DeleteTodo
}

const makeSut = (): SutTypes => {
  const deleteTodoStub = mockDeleteTodo()
  const sut = new DeleteTodoController(deleteTodoStub)
  return {
    sut,
    deleteTodoStub
  }
}

describe('Delete Todo Controller', () => {
  beforeEach(async () => {
    id = faker.random.uuid()
    accountId = faker.random.uuid()
    title = faker.random.word()
    description = faker.random.words()
    date = faker.date.recent()
    active = false
  })

  it('Should return 400 if no id is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        description
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('id')))
  })

  it('Should call DeleteTodo with correct values', async () => {
    const { sut, deleteTodoStub } = makeSut()
    const deleteTodoSpy = jest.spyOn(deleteTodoStub, 'delete')
    const httpRequest = {
      body: {
        id
      }
    }
    await sut.handle(httpRequest)
    expect(deleteTodoSpy).toBeCalledWith(id)
  })

  it('Should throw if DeleteTodo throws', async () => {
    const { sut, deleteTodoStub } = makeSut()
    jest.spyOn(deleteTodoStub, 'delete').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        id
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError())
  })

  it('Should return an todo on success', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        id
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(success(mockTodo()))
  })
})
