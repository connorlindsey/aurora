import bcrypt from 'bcryptjs'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { pool } from '../../config'

export const register = async (req: Request, res: Response) => {
  let { email, password, name = '' } = req.body
  let created_at = Date.now()
  try {
    let hashedPassword = await bcrypt.hash(password, 10)

    pool.query(
      ` 
      INSERT INTO account(email, password, created_at, role, name) 
      VALUES ($1, $2, to_timestamp($3), $4, $5)
      RETURNING *;
	  `,
      [email, hashedPassword, created_at, 'DEFAULT', name],
      async (e: Error, result) => {
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
        const id = result.rows[0].id
        storeToken(id, token)
        return res
          .cookie('TOKEN', token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production' ? true : false,
          })
          .status(200)
          .json({
            status: 'Success',
            message: 'User added',
            user: {
              role: result.rows[0].role,
              id,
              authenticated: true,
            },
          })
      }
    )
  } catch (e) {
    if (e instanceof Error) {
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
    storeToken(rows[0].id, token)
    return res
      .cookie('TOKEN', token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production' ? true : false,
      })
      .status(200)
      .json({
        status: 'Success',
        user: {
          role: rows[0].role,
          id: rows[0].id,
          authenticated: true,
        },
      })
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return res.status(500).json({ status: 'Error', message: e.message })
    }
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM session WHERE token = $1', [req.body.token])
    return res.cookie('TOKEN', { maxAge: 0 }).status(200).clearCookie('TOKEN').end()
  } catch (e) {
    return res.cookie('TOKEN', { maxAge: 0 }).status(500).clearCookie('TOKEN').end()
  }
}

// Returns whether the user is authenticated and their role
export const validateSession = async (req: Request, res: Response) => {
  try {
    if (!res.locals.authStatus.isAuthenticated) {
      return res.status(400).json({ status: 'Error', message: 'User is not logged in' })
    }

    return res.status(200).json({
      status: 'Success',
      user: {
        role: res.locals.authStatus.role,
        id: res.locals.authStatus.id,
        authenticated: res.locals.authStatus.isAuthenticated,
      },
    })
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return res.status(500).json({ status: 'Error', message: e.message })
    }
  }
}

// Middleware to authenticate each request
export const authenticateRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.TOKEN || ''
    const { rows } = await pool.query(
      `
      SELECT s.expires_at, a.role, a.id FROM session AS s 
      LEFT JOIN account AS a ON s.user_id = a.id
      WHERE s.token = $1;
      `,
      [token]
    )

    if (rows.length === 1 && rows[0].expires_at > Date.now()) {
      res.locals.authStatus = { isAuthenticated: true, id: rows[0].id, role: rows[0].role }
      // TODO: Optional - Push back expires_at on each request or when it is within a certain time period
      // Also would have to set back date on token
      next()
    } else {
      throw new Error('Invalid session')
    }
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message)
      res.locals.authStatus = { isAuthenticated: false, error: e.message }
      next()
    }
  }
}

const storeToken = async (user_id: number, token: string) => {
  try {
    const expires_at = Date.now() + 24 * 60 * 60 * 1000
    await pool.query(
      'INSERT INTO session (user_id, token, expires_at) VALUES ($1, $2, to_timestamp($3))',
      [user_id, token, expires_at]
    )
  } catch (e) {
    throw e
  }
}

export const updatePassword = async (req: Request, res: Response) => {
  const { password, currPassword } = req.body
  const { isAuthenticated, id } = res.locals.authStatus

  try {
    if (!isAuthenticated) throw new Error('Invalid Request')

    // 1. Get user
    const { rows } = await pool.query('SELECT * FROM account WHERE id = $1', [id])
    if (rows.length < 1) {
      return res.status(400).json({ status: 'Error', message: 'User not found' })
    }
    // 2. Validate password
    const isValidPassword = await bcrypt.compare(currPassword, rows[0].password)
    if (!isValidPassword) {
      return res.status(400).json({ status: 'Error', message: 'Incorrect password' })
    }

    // 3. Store new password
    let hashedPassword = await bcrypt.hash(password, 10)
    await pool.query('UPDATE account SET password = $1 WHERE id = $2', [hashedPassword, id])

    return res.status(200).json({ status: 'Success' })
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return res.status(500).json({ status: 'Error', message: e.message })
    }
  }
}
