import { AddTodoController } from '@/presentation/controller/add-todo-controller'
import { makeDbAddTodo } from '@/main/factories/usecase'
import { makeAddTodoValidation } from '@/main/factories/validation'

export const makeAddTodoController = (): AddTodoController => {
  return new AddTodoController(makeDbAddTodo(), makeAddTodoValidation())
}
