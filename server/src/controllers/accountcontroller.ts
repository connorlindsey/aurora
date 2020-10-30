import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { pool } from '../../config'

export const register = async (req: Request, res: Response) => {
  let { email, password } = req.body
  let created_at = Date.now()
  try {
    let hashedPassword = await bcrypt.hash(password, 10)

    pool.query(
      'INSERT INTO account (email, password, created_at, role) VALUES ($1, $2, to_timestamp($3), $4)',
      [email, hashedPassword, created_at, 'DEFAULT'],
      (e: Error) => {
        if (e) {
          console.error(e.message)

          if (e.message.includes('duplicate key value')) {
            return res
              .status(500)
              .json({ status: 'Error', message: 'Email address already in use.' })
          }
          return res.status(500).json({ status: 'Error', message: e.message })
        }

        const token = jwt.sign({ email }, process.env.APP_SECRET, {
          expiresIn: '24h',
        })
        storeToken(email, token)
        return res.status(200).json({ status: 'Success', message: 'user added', token })
      }
    )
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return res.status(500).json({ status: 'Error', message: e.message })
    }
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    // 1. Get user
    const { rows } = await pool.query('SELECT * FROM account WHERE email = $1', [email])
    if (rows.length < 1) {
      return res.status(400).json({ status: 'Error', message: 'User not found' })
    }

    // 2. Validate password
    const isValidPassword = await bcrypt.compare(password, rows[0].password)
    if (!isValidPassword) {
      return res.status(400).json({ status: 'Error', message: 'Incorrect password' })
    }

    // 3. Sign token and return
    const token = jwt.sign({ email }, process.env.APP_SECRET, {
      expiresIn: '24h',
    })
    storeToken(email, token)
    return res.status(200).json({ status: 'Success', message: 'user added', token })
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return res.status(500).json({ status: 'Error', message: e.message })
    }
  }
}

export const validateSession = async (req: Request, res: Response) => {
  const { token, email, level } = req.body
  console.log(req.body)
  try {
    const { rows } = await pool.query('SELECT * FROM session WHERE token = $1 AND email = $2', [
      token,
      email,
    ])
    console.log('rows', rows)
    if (rows.length === 1 && !level) {
      console.log('Found session. No level')
      return res.status(200).send()
    }

    if (level) {
      const { rows } = await pool.query('SELECT role FROM account WHERE email = $1', [email])
      console.log('rows 2', rows)
      if (rows.length === 1 && rows[0].role === level) {
        console.log('Found role')
        return res.status(200).send()
      }
    }

    return res.status(400).send()
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return res.status(500).send()
    }
  }
}

const storeToken = async (email: string, token: string) => {
  try {
    const expires_at = Date.now() - 24 * 60 * 60 * 1000
    await pool.query(
      'INSERT INTO session (email, token, expires_at) VALUES ($1, $2, to_timestamp($3))',
      [email, token, expires_at]
    )
  } catch (e) {
    throw e
  }
}
