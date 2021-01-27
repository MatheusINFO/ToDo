import faker from 'faker'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { AccountModel } from '@/domain/models'
import { Decrypter, LoadAccountByTokenRepository } from '@/data/protocols'

let id: any, name: any, email: any, password: any, token: any

const mockAccount = (): AccountModel => {
  return {
    id,
    name,
    email,
    password
  }
}

const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return token
    }
  }
  return new DecrypterStub()
}

const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string): Promise<AccountModel> {
      return mockAccount()
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository()
  const decrypterStub = mockDecrypter()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('LoadAccountByToken Usecase', () => {
  beforeEach(() => {
    id = faker.random.uuid()
    name = faker.name.findName()
    email = faker.internet.email()
    password = faker.internet.password()
    token = faker.random.uuid()
  })

  it('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.loadByToken(token)
    expect(decrypterSpy).toHaveBeenCalledWith(token)
  })

  it('Should return null if decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(null)
    const httpResponse = await sut.loadByToken(token)
    expect(httpResponse).toBeNull()
  })

  it('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = sut.loadByToken(token)
    await expect(httpResponse).rejects.toThrow()
  })

  it('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.loadByToken(token)
    expect(loadByTokenSpy).toHaveBeenCalledWith(token)
  })

  it('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(null)
    const httpResponse = await sut.loadByToken(token)
    expect(httpResponse).toBeNull()
  })

  it('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = sut.loadByToken(token)
    await expect(httpResponse).rejects.toThrow()
  })
})
