import faker from 'faker'
import { HashComparer, LoadAccountByEmailRepository, TokenGenerator, UpdateAccessTokenRepository } from '@/data/protocols'
import { DbAuthentication } from '@/data/usecases'
import { AccountModel } from '@/domain/models'

let id: any, name: any, email: any, password: any, token: any

const mockAccount = (): AccountModel => {
  return {
    id,
    name,
    email,
    password
  }
}

const mockUpdateAccessToken = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenStub implements UpdateAccessTokenRepository {
    async update (id: string, token: string): Promise<void> {}
  }
  return new UpdateAccessTokenStub()
}

const mockTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return token
    }
  }
  return new TokenGeneratorStub()
}

const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return true
    }
  }
  return new HashComparerStub()
}

const mockLoadAccountByEmail = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return mockAccount()
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const updateAccessTokenStub = mockUpdateAccessToken()
  const tokenGeneratorStub = mockTokenGenerator()
  const hashComparerStub = mockHashComparer()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmail()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub, updateAccessTokenStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenStub
  }
}

describe('Authentication', () => {
  beforeEach(() => {
    id = faker.random.uuid()
    name = faker.name.findName()
    email = faker.internet.email()
    password = faker.internet.password
    token = faker.random.uuid()
  })

  it('Should call LoadAccountByEmailRepository with correct values', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadAccountSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    const httpRequest = mockAccount()
    await sut.auth(httpRequest)
    expect(loadAccountSpy).toHaveBeenCalledWith(httpRequest.email)
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(mockAccount())
    await expect(promise).rejects.toThrow()
  })

  it('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const hashComparerSpy = jest.spyOn(hashComparerStub, 'compare')
    const httpRequest = mockAccount()
    await sut.auth(httpRequest)
    expect(hashComparerSpy).toHaveBeenCalledWith(password, password)
  })

  it('Should return null if HashComparer returns null', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(null)
    const httpRequest = mockAccount()
    const httpResponse = await sut.auth(httpRequest)
    expect(httpResponse).toBe(null)
  })

  it('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(mockAccount())
    await expect(promise).rejects.toThrow()
  })

  it('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const tokenGeneratorSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    const httpRequest = mockAccount()
    await sut.auth(httpRequest)
    expect(tokenGeneratorSpy).toHaveBeenCalledWith(httpRequest.id)
  })

  it('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(mockAccount())
    await expect(promise).rejects.toThrow()
  })

  it('Should return a hash on TokenGenerator success', async () => {
    const { sut } = makeSut()
    const httpRequest = mockAccount()
    const httpResponse = await sut.auth(httpRequest)
    expect(httpResponse).toBe(token)
  })

  it('Should call UpdateAccessToken with correct values', async () => {
    const { sut, updateAccessTokenStub } = makeSut()
    const updateAccessTokenSpy = jest.spyOn(updateAccessTokenStub, 'update')
    const httpRequest = mockAccount()
    await sut.auth(httpRequest)
    expect(updateAccessTokenSpy).toHaveBeenCalledWith(httpRequest.id, token)
  })

  it('Should throw if UpdateAccessToken throws', async () => {
    const { sut, updateAccessTokenStub } = makeSut()
    jest.spyOn(updateAccessTokenStub, 'update').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(mockAccount())
    await expect(promise).rejects.toThrow()
  })
})
