import faker from 'faker'
import { Collection } from 'mongodb'
import { TodoMongoRepository } from './todo-repository'
import { MongoHelper } from '@/infra/db'

let accountId: any, title: any, description: any, name: any, email: any, password: any, date: Date, active: boolean
let todoCollection: Collection
let accountCollection: Collection

const makeSut = (): TodoMongoRepository => {
  return new TodoMongoRepository()
}

describe('TodoRepository', () => {
  beforeEach(async () => {
    accountId = faker.random.uuid()
    title = faker.random.word()
    description = faker.random.words()
    name = faker.name.findName()
    email = faker.internet.email()
    password = faker.internet.password()
    date = faker.date.recent()
    active = faker.random.boolean()
    todoCollection = await MongoHelper.getCollection('todos')
    await MongoHelper.clean('todos')
    accountCollection = await MongoHelper.getCollection('accounts')
    await MongoHelper.clean('accounts')
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
        accountId,
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
      const account = await accountCollection.insertOne({
        name,
        email,
        password
      })
      const id = account.ops[0]._id
      await todoCollection.insertMany([{
        accountId: id,
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
      const todo = await sut.loadAll(id)
      expect(todo.length).toBe(1)
      expect(todo[0].id).toBeTruthy()
      expect(todo[0].title).toBe(title)
      expect(todo[0].description).toBe(description)
      expect(todo[0].date).toEqual(date)
      expect(todo[0].active).toBe(active)
      expect(todo[1]).toBeFalsy()
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
