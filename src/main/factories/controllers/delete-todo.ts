import { DeleteTodoController } from '@/presentation/controller/delete-todo-controller'
import { makeDbDeleteTodo } from '@/main/factories/usecase'

export const makeDeleteTodo = (): DeleteTodoController => {
  return new DeleteTodoController(makeDbDeleteTodo())
}
