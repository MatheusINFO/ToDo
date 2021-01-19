import faker from 'faker'
import { DbAddAccount } from './db-add-account'
import { Encrypter , AddAccountRepository } from '@/data/protocols'
import { AccountModel } from '@/domain/models'
import { AddAccount } from '@/domain/usecases'

let id: any, name: any, email: any, password: any

const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccount.Params): Promise<AccountModel> {
      const fakeAccount = {
        id,
        name,
        email,
        password
      }
      return fakeAccount
    }
  }
  return new AddAccountRepositoryStub()
}

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
  addAccountRepository: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const addAccountRepository = mockAddAccountRepository()
  const encrypterStub = mockEncrypter()
  const sut = new DbAddAccount(encrypterStub, addAccountRepository)
  return {
    sut,
    encrypterStub,
    addAccountRepository
  }
}

describe('DbAddAccount Usecase', () => {
  beforeEach(() => {
    id = faker.random.uuid()
    name = faker.name.findName()
    email = faker.internet.email()
    password = faker.internet.password()
  })

  it('Shoudl call encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const httpRequest = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add({
      name,
      email,
      password
    })
    expect(httpRequest).toHaveBeenCalledWith(password)
  })

  it('Shoudl throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementation(() => {
      throw new Error()
    })
    const httpRequest = sut.add({
      name,
      email,
      password
    })
    await expect(httpRequest).rejects.toThrow()
  })

  it('Shoudl call AddAccountRepository with correct password', async () => {
    const { sut, addAccountRepository } = makeSut()
    const httpRequest = jest.spyOn(addAccountRepository, 'add')
    const accountData = {
      name,
      email,
      password
    }
    await sut.add(accountData)
    expect(httpRequest).toHaveBeenCalledWith(accountData)
  })

  it('Shoudl throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepository } = makeSut()
    jest.spyOn(addAccountRepository, 'add').mockImplementation(() => {
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

  it('Shoudl return an account on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.add({
      name,
      email,
      password
    })
    expect(httpResponse).toEqual({
      id,
      name,
      email,
      password
    })
  })
})
