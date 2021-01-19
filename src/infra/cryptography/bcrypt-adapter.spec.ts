import bcrypt from 'bcrypt'
import faker from 'faker'
import { BcryptAdapter } from './bcrypt-adapter'

const salt = 12
let hash: any, value: any

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return hash
  }
}))

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  beforeEach(() => {
    hash = faker.random.uuid()
    value = faker.random.uuid()
  })

  it('Should call bcrypt with correct valeus', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt(value)
    expect(hashSpy).toHaveBeenCalledWith(value, salt)
  })

  it('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = sut.encrypt(value)
    await expect(httpResponse).rejects.toThrow()
  })

  it('Should return a hash value on success', async () => {
    const sut = makeSut()
    const httpResponse = await sut.encrypt(value)
    expect(httpResponse).toBe(hash)
  })
})
