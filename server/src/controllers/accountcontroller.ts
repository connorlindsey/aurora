import { Request, Response } from 'express'
import { pool } from '../../config'

export const register = (req: Request, res: Response) => {
  let { email, password } = req.body
  let created_at = Date()
  // TODO: Encrypt password

  pool.query(
    'INSERT INTO user (email, password, created_at) VALUES ($1, $2, $3)',
    [email, password, created_at],
    (error: Error) => {
      if (error) {
        console.error(error.message)
        res.status(500).json({ status: 'Error', message: error.message })
      }

      // TODO: Generate token and send back
      res.status(200).json({ status: 'Success', message: 'user added' })
    }
  )
}

export const login = () => {}
