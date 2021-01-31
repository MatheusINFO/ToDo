import { makeSignUpValidation } from './signup-validation'
import { Validation , RequiredFieldValidation, ValidationComposite } from '@/presentation/helpers'

jest.mock('@/presentation/helpers/validator-composite')

describe('SignUp Validation', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
