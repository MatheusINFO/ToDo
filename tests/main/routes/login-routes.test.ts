import faker from 'faker'
import { hash } from 'bcrypt'
import request from 'supertest'
import { Collection } from 'mongodb'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db'

let name: any, email: any, password: any
let accountCollection: Collection

describe('Login Routes', () => {
  beforeEach(async () => {
    name = faker.name.findName()
    email = faker.internet.email()
    password = faker.internet.password()
    accountCollection = await MongoHelper.getCollection('accounts')
    await MongoHelper.clean('accounts')
  })

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should return 200 on login success', async () => {
    const passwordHash = await hash(password, 12)
    await accountCollection.insertOne({
      name,
      email,
      password: passwordHash,
      passwordConfirmation: passwordHash
    })
    await request(app)
      .post('/api/login')
      .send({
        email,
        password
      })
      .expect(200)
  })

  it('Should return 401 on login fails', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email,
        password
      })
      .expect(401)
  })
})
