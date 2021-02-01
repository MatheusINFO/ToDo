import faker from 'faker'
import { badRequest, serverError, success, Validation } from '@/presentation/helpers'
import { DeleteTodoController } from '@/presentation/controller'
import { DeleteTodo } from '@/domain/usecases'
import { Todo } from '@/domain/models'
import { mockValidation } from '@/tests/presentation/mocks'

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
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const deleteTodoStub = mockDeleteTodo()
  const sut = new DeleteTodoController(deleteTodoStub, validationStub)
  return {
    sut,
    deleteTodoStub,
    validationStub
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

  it('Shoudl call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = {
      body: {
        id
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
        id
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
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
