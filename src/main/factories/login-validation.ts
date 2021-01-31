import { EmailValidatorAdapter } from '@/infra/validators'
import { RequiredFieldValidation, Validation, ValidationComposite } from '@/presentation/helpers'
import { EmailValidation } from '@/presentation/helpers/email-validation'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
