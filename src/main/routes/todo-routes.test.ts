import faker from 'faker'
import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db'
import env from '../config/env'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'

let title: any, description: any
let accountCollection: Collection

const mockAccessToken = async (): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  })
  const id = result.ops[0]._id
  const accessToken = sign({ id }, env.secret)
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}

describe('Todo Routes', () => {
  beforeEach(async () => {
    title = faker.random.word()
    description = faker.random.words()
    accountCollection = await MongoHelper.getCollection('accounts')
    await MongoHelper.clean('todos')
    await MongoHelper.clean('accounts')
  })

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /todo', () => {
    it('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/todo')
        .send({
          title,
          description
        })
        .expect(403)
    })

    it('Should return an todo on success', async () => {
      const accessToken = await mockAccessToken()
      await request(app)
        .post('/api/todo')
        .set('x-access-token', accessToken)
        .send({
          title,
          description
        })
        .expect(200)
    })
  })

  describe('GET /todo', () => {
    it('Should return 403 on get surveys without accessToken', async () => {
      await request(app)
        .get('/api/todo')
        .expect(403)
    })

    it('Should return a success on get successful', async () => {
      const accessToken = await mockAccessToken()
      await request(app)
        .get('/api/todo')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })

  describe('DELETE /todo', () => {
    it('Should return 403 on delete survey without accessToken', async () => {
      await request(app)
        .get('/api/todo')
        .expect(403)
    })

    it('Should return 400 if todo not exists', async () => {
      const accessToken = await mockAccessToken()
      await request(app)
        .delete('/api/todo')
        .set('x-access-token', accessToken)
        .send({})
        .expect(400)
    })
  })
})
