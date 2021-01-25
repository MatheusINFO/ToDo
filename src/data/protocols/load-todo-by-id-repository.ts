import { Todo } from '@/domain/models'

export interface LoadTodoByIdRepository {
  loadById (id: string): Promise<Todo>
}
