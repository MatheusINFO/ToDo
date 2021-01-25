import { LoadTodo } from '@/domain/usecases'

export interface LoadTodoRepository {
  loadAll (): Promise<LoadTodo.Result>
}
