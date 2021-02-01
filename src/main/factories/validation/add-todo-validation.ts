import { Validation } from '@/presentation/helpers'
import { RequiredFieldValidation, ValidationComposite } from '@/validation'

export const makeAddTodoValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['title', 'description']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
