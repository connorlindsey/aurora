import { Request, Response } from 'express'
import { register } from '../src/controllers/account'

describe('Sign up', () => {
  it('should register a new user', async () => {
    let req = { body: { email: 'test@unit.com', password: 'test123' } } as Request
    let res = {} as Response
    await register(req, res)
  })
})
