import { HttpResponse } from '@/presentation/protocols'
import { ServerError, UnauthorizedError } from '../errors'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})

export const success = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
