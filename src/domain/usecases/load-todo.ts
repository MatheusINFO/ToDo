import { Todo } from '@/domain/models'

export interface LoadTodo {
  loadAll (): Promise<LoadTodo.Result>
}

export namespace LoadTodo {
  export type Result = Todo[]
}
