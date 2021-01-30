import { LoadTodo } from '@/domain/usecases'

export interface LoadTodoRepository {
  loadAll (accountId: LoadTodo.Params): Promise<LoadTodo.Result>
}
