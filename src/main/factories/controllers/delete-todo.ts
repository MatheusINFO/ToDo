import { DeleteTodoController } from '@/presentation/controller/delete-todo-controller'
import { makeDbDeleteTodo } from '@/main/factories/usecase'
import { makeDeleteTodoValidation } from '@/main/factories/validation'

export const makeDeleteTodo = (): DeleteTodoController => {
  return new DeleteTodoController(makeDbDeleteTodo(), makeDeleteTodoValidation())
}
