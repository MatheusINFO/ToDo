import { AddTodoRepository } from '@/data/protocols'
import { AddTodo } from '@/domain/usecases'
import { MongoHelper } from '../helper/mongo-helper'

export class TodoMongoRepository implements AddTodoRepository {
  async add (todo: AddTodo.Params): Promise<AddTodo.Result> {
    const todoCollection = MongoHelper.getCollection('todos')
    const result = await todoCollection.insertOne(todo)
    const todoData = result.ops[0]
    return MongoHelper.map(todoData)
  }
}
