import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { pool } from './config'
import {
  login,
  logout,
  register,
  updatePassword,
  validateSession,
} from './src/controllers/admin'
import { getAccounts, getEarlyAccess } from './src/controllers/account'
import { 
	getAllAims,
	getAims,
	getAim,
	createAim,
	deleteAim,
	editAim,
} from './src/controllers/aim'

const PORT = process.env.PORT || 8000
const isProduction = process.env.NODE_ENV === 'production'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  cors({
    origin: isProduction ? 'https://twelvemonth.vercel.app' : '*',
  })
)

app.get('/', (req, res) => res.send('twelvemonth API'))

// Early Access
const addEarlyAccess = (req, res) => {
  console.info('Add early access')
  const { email, name } = req.body
  console.log('email', email)
  console.log('name', name)
  pool.query('INSERT INTO earlyaccess (email, name) VALUES ($1, $2)', [email, name], (error) => {
    if (error) {
      console.error(error.message)
      res.status(500).json({ status: 'Error', message: error.message })
    }
    res.status(200).json({ status: 'Success', message: 'Subscriber added' })
  })
}

// Early Access
app.route('/earlyaccess').get(getEarlyAccess).post(addEarlyAccess)

// Authentication
app.route('/register').post(register)
app.route('/login').post(login)
app.route('/authenticate').post(validateSession)
app.route('/logout').post(logout)
app.route('/updatePassword').post(updatePassword)

// Admin
app.route('/admin/accounts').get(getAccounts)
app.route('/admin/earlyAccess').get(getEarlyAccess)
app.route('/admin/aims').get(getAllAims)
app.route('/aims/:user_id').get(getAims)     // get all aims for a user
app.route('/aim/:user_id/:aim_id').get(getAim)       // get aim
app.route('/aim').post(createAim)   // create aim
app.route('/aim').put(editAim)      // edit aim
app.route('/aim').delete(deleteAim) // delete aim

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})

process.on('uncaughtException', function (error) {
  console.log(error.stack)
})
