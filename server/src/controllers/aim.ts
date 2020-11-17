import { Request, Response } from 'express'
import { pool } from '../../config'


// createAim
// editAim
// delteAim
// getAims
// getAim (aim entries)
// markAimComplete
// markAimIncomplete

export const getAllAims = async (req: Request, res: Response) => {
	try {
	  console.log('getAims')
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
	  
		let user_id = req.params['user_id'] 
	  console.log(`[getAims input] user_id: ${user_id}`)

	  const { rows } = await pool.query(`
	 	SELECT * FROM aim WHERE account_id = '${user_id}';
	  `)
	  return res.status(200).json(rows)
	} catch (e) {
	  if (e instanceof Error) {
		console.error(e.message)
		return res.status(500).json({ status: 'Error', message: e.message })
	  }
	}
}

export const getAim = async (req: Request, res: Response) => {
	try {
	  let user_id = req.params['user_id'] 
	  let aim_id = req.params['aim_id']
	  
	  console.log(`[getAim input] user_id: ${user_id}, aim_id:${aim_id}`)

	  const { rows } = await pool.query(`
	 	 SELECT * FROM aim WHERE id = '${aim_id}' AND account_id = '${user_id}';
	  `)
	  return res.status(200).json(rows)
	} catch (e) {
	  if (e instanceof Error) {
		console.error(e.message)
		return res.status(500).json({ status: 'Error', message: e.message })
	  }
	}
}

export const deleteAim = async (req: Request, res: Response) => { // test this
	try {
	 
    let aim_id = req.body['aim_id']
	  console.log(`[deleteAim input] aim_id:${aim_id}`)
	  const { rows } = await pool.query(`
	 	  DELETE FROM aim WHERE id = '${aim_id}' RETURNING *;
	  `)
	  return res.status(200).json(rows)
	} catch (e) {
	  if (e instanceof Error) {
		console.error(e.message)
		return res.status(500).json({ status: 'Error', message: e.message })
	  }
	}
}

export const createAim = async (req: Request, res: Response) => {
	try {

    let user_id = req.body['user_id']
    let name  = req.body['name']
    let description = req.body['description']
    
    console.log(`[createAim input] user_id:${user_id}, name:${name}, description:${description} `)
    const { rows } = await pool.query(`
      INSERT INTO aim(id, name, created_at, account_id, description) 
      VALUES (DEFAULT, '${name}', NOW(), '${user_id}', '${description}')
      RETURNING *;
	  `)
	  return res.status(200).json(rows)
	} catch (e) {
	  if (e instanceof Error) {
		console.error(e.message)
		return res.status(500).json({ status: 'Error', message: e.message })
	  }
	}
}


export const editAim = async (req: Request, res: Response) => {
	try {

    let name  = req.body?.name
    let description = req.body?.description
    let aim_id = req.body?.aim_id

    if(!name && !description) throw new Error('Must include aim attribute to update.') 

    console.log(`[editAim input] aim_id: ${aim_id}, name: ${name}, description: ${description} `)
    const { rows } = await pool.query(`
      UPDATE aim SET
        ${ name? `name = '${name}',`: '' } 
        ${ description? `description = '${description}'`: '' } 
      WHERE id='${aim_id}'
      RETURNING *;
	  `)
	  return res.status(200).json(rows)
	} catch (e) {
	  if (e instanceof Error) {
		console.error(e.message)
		return res.status(500).json({ status: 'Error', message: e.message })
	  }
	}
}
  