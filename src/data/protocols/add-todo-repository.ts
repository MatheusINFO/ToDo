import { AddTodo } from '@/domain/usecases/add-todo'

export interface AddTodoRepository {
  add (todo: AddTodo.Params): Promise<AddTodo.Result>
}
