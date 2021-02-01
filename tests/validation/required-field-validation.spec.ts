import faker from 'faker'
import { MissingParamError } from '@/presentation/errors'
import { RequiredFieldValidation } from '@/validation'

let field: any

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe('RequiredFieldValidation', () => {
  beforeEach(() => {
    field = faker.random.uuid()
  })

  it('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: ''
    })
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('Should not return if validation succeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      field
    })
    expect(error).toBeFalsy()
  })
})
