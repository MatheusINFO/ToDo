import { DeleteTodo } from '@/domain/usecases/delete-todo'

export interface DeleteTodoRepository {
  delete (id: DeleteTodo.Params): Promise<DeleteTodo.Result>
}
