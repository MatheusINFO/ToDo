import jwt from 'jsonwebtoken'
import faker from 'faker'
import { JwtAdapter } from './jwt-adapter'

let token: any, id: any

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return token
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('Token Generator', () => {
  beforeEach(() => {
    token = faker.random.uuid()
    id = faker.random.uuid()
  })

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
    const promsie = sut.generate(id)
    await expect(promsie).rejects.toThrow()
  })
})
