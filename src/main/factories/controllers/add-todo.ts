import { AddTodoController } from '@/presentation/controller/add-todo-controller'
import { makeDbAddTodo } from '@/main/factories/usecase'

export const makeAddTodoController = (): AddTodoController => {
  return new AddTodoController(makeDbAddTodo())
}
