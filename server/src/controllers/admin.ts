import { Request, Response } from 'express'
import { pool } from '../../config'

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const { isAuthenticated, role } = res.locals.authStatus
    if (!isAuthenticated || role !== 'ADMIN') {
      throw new Error('Unauthenticated request')
    }
    const { rows } = await pool.query(`SELECT * FROM account;`)
    return res.status(200).json({ status: 'Success', data: rows })
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return res.status(500).json({ status: 'Error', message: e.message })
    }
  }
}

export const getEarlyAccess = async (req: Request, res: Response) => {
  try {
    const { isAuthenticated, role } = res.locals.authStatus
    if (!isAuthenticated || role !== 'ADMIN') {
      throw new Error('Unauthenticated request')
    }
    const { rows } = await pool.query(`SELECT * FROM earlyaccess;`)
    return res.status(200).json({ status: 'Success', data: rows })
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return res.status(500).json({ status: 'Error', message: e.message })
    }
  }
}
