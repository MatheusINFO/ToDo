import faker from 'faker'
import { AccountMongoRepository } from './account-repository'
import { MongoHelper } from '@/infra/db'

let name: any, email: any, password: any

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('AccountRepository', () => {
  beforeEach(() => {
    name = faker.name.findName()
    email = faker.internet.email()
    password = faker.internet.password()
  })

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should return an account on success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name,
      email,
      password
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(name)
    expect(account.email).toBe(email)
    expect(account.password).toBe(password)
  })
})
