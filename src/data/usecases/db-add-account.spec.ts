import faker from 'faker'
import { DbAddAccount } from './db-add-account'
import { Encrypter } from '@/data/protocols'

let name: any, email: any, password: any

const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return password
    }
  }
  return new EncrypterStub()
}

type SutTypes = {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const encrypterStub = mockEncrypter()
  const sut = new DbAddAccount(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}

describe('DbAddAccount Usecase', () => {
  beforeEach(() => {
    name = faker.name.findName()
    email = faker.internet.email()
    password = faker.internet.password()
  })

  it('Shoudl call encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const httpRequest = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name,
      email,
      password
    }
    await sut.add(accountData)
    expect(httpRequest).toHaveBeenCalledWith(password)
  })

  it('Shoudl throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementation(() => {
      throw new Error()
    })
    const accountData = {
      name,
      email,
      password
    }
    const httpRequest = sut.add(accountData)
    await expect(httpRequest).rejects.toThrow()
  })
})
