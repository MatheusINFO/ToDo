import faker from 'faker'
import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from './compare-field-validation'

let field: any, fieldToCompare: any

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('CompareFieldsValidation', () => {
  beforeEach(() => {
    field = faker.random.uuid()
    fieldToCompare = field
  })

  it('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      field,
      fieldToCompare: ''
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  it('Should not return if validation succeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      field,
      fieldToCompare
    })
    expect(error).toBeFalsy()
  })
})
