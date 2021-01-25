import { AddTodoRepository, LoadTodoRepository , DeleteTodoRepository } from '@/data/protocols'
import { AddTodo, LoadTodo } from '@/domain/usecases'
import { DeleteTodo } from '@/domain/usecases/delete-todo'
import { MongoHelper } from '@/infra/db'

export class TodoMongoRepository implements AddTodoRepository, LoadTodoRepository, DeleteTodoRepository {
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

  async delete (id: DeleteTodo.Params): Promise<DeleteTodo.Result> {
    const todoCollection = MongoHelper.getCollection('todos')
    const { value } = await todoCollection.findOneAndUpdate({ _id: id }, {
      $set: {
        active: false
      }
    }, {
      returnOriginal: false
    })
    return value && MongoHelper.map(value)
  }
}
