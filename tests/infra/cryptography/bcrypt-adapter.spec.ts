import bcrypt from 'bcrypt'
import faker from 'faker'
import { BcryptAdapter } from '@/infra/cryptography'

const salt = 12
let hash: any, value: any

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return hash
  },

  async compare (value: string, hash: string): Promise<boolean> {
    return true
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

  it('Should call Comparer with correct valeus', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare(value, hash)
    expect(compareSpy).toHaveBeenCalledWith(value, hash)
  })

  it('Should return true if Comparer succeeds', async () => {
    const sut = makeSut()
    const httResponse = await sut.compare(value, hash)
    expect(httResponse).toBe(true)
  })

  it('Should return false if Comparer fails', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const httpResponse = await sut.compare(value, hash)
    expect(httpResponse).toBe(false)
  })

  it('Should throw if Comparer throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = sut.compare(value, hash)
    await expect(httpResponse).rejects.toThrow()
  })
})
