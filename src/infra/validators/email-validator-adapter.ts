import validator from 'validator'
import { EmailValidator } from '@/presentation/protocols'

export class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    const isEmail = validator.isEmail(email)
    if (!isEmail) {
      return false
    }
    return true
  }
}
