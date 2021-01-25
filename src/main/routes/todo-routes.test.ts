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

  describe('POST /todo', () => {
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

  describe('GET /todo', () => {
    it('Should return a success on get successful', async () => {
      await request(app)
        .get('/api/todo')
        .expect(200)
    })
  })
})
