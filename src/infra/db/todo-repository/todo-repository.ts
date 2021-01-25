import { AddTodoRepository, LoadTodoRepository } from '@/data/protocols'
import { AddTodo, LoadTodo } from '@/domain/usecases'
import { MongoHelper } from '@/infra/db'

export class TodoMongoRepository implements AddTodoRepository, LoadTodoRepository {
  async add (todo: AddTodo.Params): Promise<AddTodo.Result> {
    const todoCollection = MongoHelper.getCollection('todos')
    const result = await todoCollection.insertOne(todo)
    const todoData = result.ops[0]
    return MongoHelper.map(todoData)
  }

  async loadAll (): Promise<LoadTodo.Result> {
    const todoCollection = MongoHelper.getCollection('todos')
    const todos = await todoCollection.find().toArray()
    return todos && MongoHelper.mapCollection(todos)
  }
}
