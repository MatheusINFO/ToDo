import { Todo } from '@/domain/models'

export interface AddTodo {
  add (todo: AddTodo.Params): Promise<AddTodo.Result>
}

export namespace AddTodo {
  export type Params = Omit<Todo, 'id'>

  export type Result = Todo
}
