import express from 'express'
const app = express()
const PORT = 8000

app.get('/', (req, res) => res.send('Express + TypeScript Server'))

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
