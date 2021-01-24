import { Todo } from '@/domain/models'

export interface AddTodo {
  add (todo: AddTodo.Params): Promise<AddTodo.Result>
}

export namespace AddTodo {
  export type Params = {
    title: string
    description: string
  }

  export type Result = Todo
}
