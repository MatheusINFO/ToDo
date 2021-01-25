export interface DeleteTodo {
  delete (id: DeleteTodo.Params): Promise<void>
}

export namespace DeleteTodo {
  export type Params = string
}
