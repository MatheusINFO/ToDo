import { Todo } from '../models'

export interface DeleteTodo {
  delete (id: DeleteTodo.Params): Promise<DeleteTodo.Result>
}

export namespace DeleteTodo {
  export type Params = string

  export type Result = Todo
}
