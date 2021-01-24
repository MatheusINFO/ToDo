import faker from 'faker'
import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db'

let title: any, description: any

describe('Todo Routes', () => {
  beforeEach(async () => {
    title = faker.random.word()
    description = faker.random.words()
    await MongoHelper.clean('todos')
  })

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should return an todo on success', async () => {
    await request(app)
      .post('/api/todo')
      .send({
        title,
        description
      })
      .expect(200)
  })
})
