import { Todo } from '@/domain/models'

export interface LoadTodo {
  loadAll (accountId: string): Promise<LoadTodo.Result>
}

export namespace LoadTodo {
  export type Params = string

  export type Result = Todo[]
}
