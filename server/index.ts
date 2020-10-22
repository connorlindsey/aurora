import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { pool } from './config'

const PORT = process.env.PORT || 8000

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req, res) => res.send('twelvemonth API'))

// Early Access
const getEarlyAcces = (req, res) => {
  pool.query('SELECT * FROM earlyaccess', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const addEarlyAccess = (req, res) => {
  const { email, name } = req.body
  console.log('email', email)
  console.log('name', name)
  pool.query('INSERT INTO earlyaccess (email, name) VALUES ($1, $2)', [email, name], (error) => {
    if (error) {
      res.status(500).json({ status: 'Error', message: error.message })
    }
    res.status(200).json({ status: 'Success', message: 'Subscriber added' })
  })
}

app.route('/earlyaccess').get(getEarlyAcces).post(addEarlyAccess)

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
