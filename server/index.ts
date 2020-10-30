import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { pool } from './config'
import { login, register, validateSession } from './src/controllers/accountcontroller'

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
const getEarlyAccess = (req, res) => {
  console.info('Get early access')
  pool.query('SELECT * FROM earlyaccess', (error, results) => {
    if (error) {
      console.error(error.message)
      res.status(500).json({ status: 'Error', message: error.message })
    }
    res.status(200).json(results.rows)
  })
}

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

app.route('/earlyaccess').get(getEarlyAccess).post(addEarlyAccess)
app.route('/register').post(register)
app.route('/login').post(login)
app.route('/session').post(validateSession)

// Aims
type Aim = {
  id: number
  name: string
}
const aims: Aim[] = [
  { id: 1, name: 'Stretch' },
  { id: 2, name: 'Read' },
  { id: 3, name: 'Journal' },
]

app.get('/aims', (req, res) => res.json(aims))

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})

process.on('uncaughtException', function (error) {
  console.log(error.stack)
})
