import { LoadTodoController } from '@/presentation/controller/todo/load-todo/load-todo-controller'
import { makeDbLoadTodo } from '@/main/factories/usecase'

export const makeLoadTodoController = (): LoadTodoController => {
  return new LoadTodoController(makeDbLoadTodo())
}
