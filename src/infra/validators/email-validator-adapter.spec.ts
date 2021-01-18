import validator from 'validator'
import faker from 'faker'
import { EmailValidatorAdapter } from './email-validator-adapter'

let email: any

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('Email Validator', () => {
  beforeEach(() => {
    email = faker.internet.email()
  })

  it('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const httpResponse = sut.isValid('false-email')
    expect(httpResponse).toBe(false)
  })

  it('Should call EmailValidator with correct email', () => {
    const sut = new EmailValidatorAdapter()
    const httpRequest = jest.spyOn(validator, 'isEmail')
    sut.isValid(email)
    expect(httpRequest).toHaveBeenCalledWith(email)
  })

  it('Should return EmailValidator on success', () => {
    const sut = new EmailValidatorAdapter()
    const httpResponse = sut.isValid(email)
    expect(httpResponse).toBe(true)
  })
})
