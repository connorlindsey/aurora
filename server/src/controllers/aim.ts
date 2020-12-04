import { Request, Response } from 'express'
import { pool } from '../../config'

export const getAllAims = async (req: Request, res: Response) => {
  try {
    const { isAuthenticated, role } = res.locals.authStatus
    if (!isAuthenticated || role !== 'ADMIN') {
      throw new Error('Unauthenticated request')
    }

    const { rows } = await pool.query(`SELECT * FROM aim;`)
    return res.status(200).json(rows)
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return res.status(500).json({ status: 'Error', message: e.message })
    }
  }
}

export const getAims = async (req: Request, res: Response) => {
  try {
    const { isAuthenticated, id } = res.locals.authStatus
    if (!isAuthenticated) throw new Error('Unathenticated request')

    const { rows } = await pool.query(`
	 		SELECT * FROM aim WHERE account_id = '${id}';
	  `)
    return res.status(200).json({ status: 'Success', data: rows })
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return res.status(500).json({ status: 'Error', message: e.message })
    }
  }
}

export const getAim = async (req: Request, res: Response) => {
  try {
    const { isAuthenticated, id: user_id } = res.locals.authStatus
    if (!isAuthenticated) throw new Error('Unathenticated request')
    let aim_id = req.params['aim_id']

    const { rows } = await pool.query(`
	 		SELECT * FROM aim WHERE id = '${aim_id}' AND account_id = '${user_id}';
	  `)
    return res.status(200).json({ status: 'Success', aim: rows[0] })
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return res.status(500).json({ status: 'Error', message: e.message })
    }
  }
}

export const deleteAim = async (req: Request, res: Response) => {
  try {
    const { aim_id } = req.body
    await pool.query(`DELETE FROM aim_entry WHERE aim_id = $1`, [aim_id])
    await pool.query(`DELETE FROM aim WHERE id = '${aim_id}'`)
    return res.status(200).json({ status: 'Success' })
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return res.status(500).json({ status: 'Error', message: e.message })
    }
  }
}

export const createAim = async (req: Request, res: Response) => {
  try {
    const { name, description = '' } = req.body
    const { isAuthenticated, id } = res.locals.authStatus
    if (!isAuthenticated) throw new Error('Unauthenticated user')

    const { rows } = await pool.query(`
      INSERT INTO aim (name, created_at, account_id, description) 
      VALUES ('${name}', NOW(), '${id}', '${description}')
      RETURNING *;
    `)

    return res.status(200).json({ status: 'Success', data: rows })
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return res.status(500).json({ status: 'Error', message: e.message })
    }
  }
}

export const editAim = async (req: Request, res: Response) => {
  try {
    const { isAuthenticated } = res.locals.authStatus
    if (!isAuthenticated) throw new Error('Unauthenticated request')

    const { name, description, aim_id } = req.body
    if (!name && !description) throw new Error('Must include aim attribute to update.')

    const { rows } = await pool.query(
      `
      UPDATE aim SET name = $1, description = $2
      WHERE id = $3
      RETURNING *;
	  `,
      [name, description, aim_id]
    )
    return res.status(200).json({ status: 'Success', data: rows })
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return res.status(500).json({ status: 'Error', message: e.message })
    }
  }
}

export const getCompletion = async (req: Request, res: Response) => {
  try {
    const { isAuthenticated } = res.locals.authStatus
    if (!isAuthenticated) throw new Error('Unauthenticated request')

    let aim_id = req.params.aim_id
    let date = req.query.date
    // console.log('\ndate', date)
    // TODO: Filter by date
    const { rows } = await pool.query(
      `
      SELECT * FROM aim_entry
      WHERE aim_id = $1
    `,
      [aim_id]
    )

    return res.status(200).json({ status: 'Success', completionData: rows })
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return res.status(500).json({ status: 'Error', message: e.message })
    }
  }
}

export const addCompletion = async (req: Request, res: Response) => {
  try {
    const { isAuthenticated } = res.locals.authStatus
    if (!isAuthenticated) throw new Error('Unauthenticated request')

    let aim_id = req.params['aim_id']
    await pool.query(`INSERT INTO aim_entry (aim_id) VALUES ($1)`, [aim_id])
    await pool.query(`UPDATE aim SET last_completed = CURRENT_DATE WHERE id = $1`, [aim_id])
    return res.status(200).json({ status: 'Success' })
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return res.status(500).json({ status: 'Error', message: e.message })
    }
  }
}

export const removeCompletion = async (req: Request, res: Response) => {
  try {
    const { isAuthenticated } = res.locals.authStatus
    if (!isAuthenticated) throw new Error('Unauthenticated request')

    let aim_id = req.params['aim_id']
    await pool.query(`DELETE FROM aim_entry where aim_id = $1 and date = CURRENT_DATE`, [aim_id])
    await pool.query(`UPDATE aim SET last_completed = NULL WHERE id = $1`, [aim_id])
    return res.status(200).json({ status: 'Success' })
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
      return res.status(500).json({ status: 'Error', message: e.message })
    }
  }
}
