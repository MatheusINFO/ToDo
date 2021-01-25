import faker from 'faker'
import { TodoMongoRepository } from './todo-repository'
import { MongoHelper } from '@/infra/db'
import { Collection } from 'mongodb'

let title: any, description: any, date: Date, active: boolean
let todoCollection: Collection

const makeSut = (): TodoMongoRepository => {
  return new TodoMongoRepository()
}

describe('TodoRepository', () => {
  beforeEach(async () => {
    title = faker.random.word()
    description = faker.random.words()
    date = faker.date.recent()
    active = faker.random.boolean()
    todoCollection = await MongoHelper.getCollection('todos')
    await MongoHelper.clean('todos')
  })

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('add()', () => {
    it('Should return an todo on success', async () => {
      const sut = makeSut()
      const todo = await sut.add({
        title,
        description,
        date,
        active
      })
      expect(todo).toBeTruthy()
      expect(todo.id).toBeTruthy()
      expect(todo.title).toBe(title)
      expect(todo.description).toBe(description)
      expect(todo.date).toBe(date)
      expect(todo.active).toBe(active)
    })
  })

  describe('loadAll()', () => {
    it('Should return all todos on success', async () => {
      await todoCollection.insertMany([{
        title,
        description,
        date,
        active
      },{
        title,
        description,
        date,
        active
      }])
      const sut = makeSut()
      const todo = await sut.loadAll()
      expect(todo.length).toBe(2)
      expect(todo[0].id).toBeTruthy()
      expect(todo[0].title).toBe(title)
      expect(todo[0].description).toBe(description)
      expect(todo[0].date).toEqual(date)
      expect(todo[0].active).toBe(active)
      expect(todo[1].id).toBeTruthy()
      expect(todo[2]).toBeFalsy()
    })
  })

  describe('delete()', () => {
    it('Should return a deleted todo on success', async () => {
      const sut = makeSut()
      const result = await todoCollection.insertOne({
        title,
        description,
        date,
        active: true
      })
      const todo = await sut.delete(result.ops[0]._id)
      expect(todo).toBeTruthy()
      expect(todo.id).toBeTruthy()
      expect(todo.title).toBe(title)
      expect(todo.description).toBe(description)
      expect(todo.date).toEqual(date)
      expect(todo.active).toBe(false)
    })
  })
})
