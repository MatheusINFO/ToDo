import faker from 'faker'
import { TodoMongoRepository } from './todo-repository'
import { MongoHelper } from '@/infra/db'

let title: any, description: any, date: Date, active: boolean

const makeSut = (): TodoMongoRepository => {
  return new TodoMongoRepository()
}

describe('TodoRepository', () => {
  beforeEach(async () => {
    title = faker.random.word()
    description = faker.random.words()
    date = faker.date.recent()
    active = faker.random.boolean()
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
})
