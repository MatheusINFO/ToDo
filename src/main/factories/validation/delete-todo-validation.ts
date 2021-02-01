import { Validation } from '@/presentation/helpers'
import { RequiredFieldValidation, ValidationComposite } from '@/validation'

export const makeDeleteTodoValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['id']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
