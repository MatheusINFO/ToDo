import faker from 'faker'
import { InvalidParamError } from '@/presentation/errors'
import { EmailValidator } from '@/presentation/protocols'
import { EmailValidation } from '@/validation'

let email: any

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('EmailValidation', () => {
  beforeEach(() => {
    email = faker.internet.email()
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = {
      email
    }
    const emailValidator = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.validate(httpRequest)
    expect(emailValidator).toHaveBeenCalledWith(email)
  })

  it('Should throw if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })

  it('Should return InvalidParamError if validation fails', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = {
      email
    }
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.validate(httpRequest)
    expect(httpResponse).toEqual(new InvalidParamError('email'))
  })
})
