import { Request, Response } from 'express'
import { pool } from '../../config'

// TODO: Add middleware to authenticate admin routes

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM account;`)
    return res.status(200).json(rows)
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return res.status(500).json({ status: 'Error', message: e.message })
    }
  }
}

export const getEarlyAccess = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM earlyaccess;`)
    return res.status(200).json(rows)
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return res.status(500).json({ status: 'Error', message: e.message })
    }
  }
}
