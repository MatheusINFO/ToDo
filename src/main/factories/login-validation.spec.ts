import { makeLoginValidation } from './login-validation'
import { Validation , RequiredFieldValidation, ValidationComposite } from '@/presentation/helpers'
import { EmailValidation } from '@/presentation/helpers/email-validation'
import { EmailValidator } from '@/presentation/protocols'

jest.mock('@/presentation/helpers/validator-composite')

const mockEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Login Validation', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', mockEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
