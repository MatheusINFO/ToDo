import { makeAddTodoValidation } from '@/main/factories/validation'
import { Validation } from '@/presentation/helpers'
import { RequiredFieldValidation, ValidationComposite } from '@/validation'

jest.mock('@/validation/validator-composite')

describe('AddTodo Validation', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeAddTodoValidation()
    const validations: Validation[] = []
    for (const field of ['title', 'description']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
