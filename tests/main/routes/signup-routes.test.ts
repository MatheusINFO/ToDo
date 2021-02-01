import faker from 'faker'
import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db'

let name: any, email: any, password: any, passwordConfirmation: any

describe('SignUp Routes', () => {
  beforeEach(async () => {
    name = faker.name.findName()
    email = faker.internet.email()
    password = faker.internet.password()
    passwordConfirmation = password
    await MongoHelper.clean('accounts')
  })

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name,
        email,
        password,
        passwordConfirmation
      })
      .expect(200)
  })
})
