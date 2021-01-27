import jwt from 'jsonwebtoken'
import faker from 'faker'
import { JwtAdapter } from './jwt-adapter'

let token: any, id: any

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return token
  },

  async verify (): Promise<string> {
    return token
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('Jwt Adapter', () => {
  beforeEach(() => {
    token = faker.random.uuid()
    id = faker.random.uuid()
  })

  describe('SIGN', () => {
    it('Should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.generate(id)
      expect(signSpy).toHaveBeenCalledWith({ id }, 'secret')
    })

    it('Should return a token on success', async () => {
      const sut = makeSut()
      const accesstoken = await sut.generate(id)
      expect(accesstoken).toBe(token)
    })

    it('Should throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.generate(id)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('VERIFY', () => {
    it('Should call verify with correct values', async () => {
      const sut = makeSut()
      const verify = jest.spyOn(jwt, 'verify')
      await sut.decrypt(token)
      expect(verify).toHaveBeenCalledWith(token, 'secret')
    })

    it('Should return a value on verify success', async () => {
      const sut = makeSut()
      const httpResponse = await sut.decrypt(token)
      expect(httpResponse).toBe(token)
    })

    it('Should throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.decrypt(id)
      await expect(promise).rejects.toThrow()
    })
  })
})
