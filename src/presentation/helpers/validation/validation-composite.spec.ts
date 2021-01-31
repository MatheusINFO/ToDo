import { ValidationComposite } from './validator-composite'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/helpers/validation'

const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [mockValidation(), mockValidation()]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('ValidationComposite', () => {
  it('Should return an error if validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('Should return the first error if more then one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new InvalidParamError('field'))
    const error = sut.validate({ field: 'value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('Should return if validation succeds', () => {
    const { sut } = makeSut()
    const error = sut.validate([])
    expect(error).toBeFalsy()
  })
})
