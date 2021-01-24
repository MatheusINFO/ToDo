import faker from 'faker'
import { Collection } from 'mongodb'
import { AccountMongoRepository } from './account-repository'
import { MongoHelper } from '@/infra/db'

let name: any, email: any, password: any, token: any
let accountCollection: Collection

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('AccountRepository', () => {
  beforeEach(async () => {
    name = faker.name.findName()
    email = faker.internet.email()
    password = faker.internet.password()
    token = faker.random.uuid()
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

  describe('load()', () => {
    it('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name,
        email,
        password
      })
      const account = await sut.load(email)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(name)
      expect(account.email).toBe(email)
      expect(account.password).toBe(password)
    })
  })

  describe('update()', () => {
    it('Should update the account token on update success', async () => {
      const sut = makeSut()
      const result = await accountCollection.insertOne({
        name,
        email,
        password
      })
      const fakeAccount = result.ops[0]
      expect(fakeAccount.accessToken).toBeFalsy()
      await sut.update(fakeAccount._id, token)
      const account = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe(token)
    })
  })
})
