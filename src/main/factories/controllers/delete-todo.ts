import { DeleteTodoController } from '@/presentation/controller/todo/delete-todo/delete-todo-controller'
import { makeDbDeleteTodo } from '@/main/factories/usecase'

export const makeDeleteTodo = (): DeleteTodoController => {
  return new DeleteTodoController(makeDbDeleteTodo())
}
