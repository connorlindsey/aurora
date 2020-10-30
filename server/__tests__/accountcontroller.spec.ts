import { Request, Response } from 'express'
import { register } from '../src/controllers/accountcontroller'

describe('Sign up', () => {
  it('should register a new user', () => {
    let req = {} as Request
    let res = {} as Response
    register(req, res)
  })
})
