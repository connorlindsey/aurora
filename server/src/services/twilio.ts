import { pool } from '../../config'
const SID = process.env.TWILIO_ACCOUNT_SID
const TOKEN = process.env.TWILIO_AUTH_TOKEN  
const SENDER =  process.env.TWILIO_VERIFIED_SENDER  

const client =	require('twilio')(SID, TOKEN )




export const sendMessage = (body: string, number: string) => {
	try {
		// console.log('sid: ', process.env.TWILIO_ACCOUNT_SID, 'token: ', process.env.TWILIO_AUTH_TOKEN, ', sender: ', process.env.TWILIO_VERIFIED_SENDER)
		
		client.messages.create({
			body,
			from: SENDER,
			to: number
	
			}).then(message => {
			console.log('sendMessage response: ', message.sid)
		}).done()
	} catch (error){
		console.log('[Error] sendSMS', error)
	}
}

export const recieveMessage = async (data) => {
	console.log('recieveMessage: ', data.body.From)
	const from = data.body.From
	const body = data.body.Body.split(',')



	console.log('body: ', body)
	let insertStatement = 	
	`INSERT INTO aim_entry(id, date, status, created_at, aim_id) VALUES`
	
	let aimEntryRequest = await getLatestAimEntryRequest(from)
	// console.log('filtered: ', 
	console.log('date: ', aimEntryRequest.date) 
	const { date } = aimEntryRequest



	aimEntryRequest.message.filter(AER => body.includes(AER.index + "")).map(FAER => { 
		insertStatement += `(DEFAULT, '${date}', true, NOW(), '${FAER.aim_id}'),`	// date seems to be getting changed here some how...wth..
	})

	insertStatement = insertStatement.slice(0, -1) + ";"
	console.log('fin tests: ', insertStatement)
	// await pool.query(insertStatement)
	// console.log(aimEntryRequest) 
}
	
export const testSMS = async () => {
	// sendMessage('what it do', '+15598167525')
	let aims = await getUserAims('1')
	let message = await createAimEntryRequest(aims).then(() => {
		return formatMessageString(aims)
	})

	console.log('msg g: ', message)
	// let message = formatMessageString(aims)
	// sendMessage(message, '+15598167525')
	console.log('laer: ', await getLatestAimEntryRequest('+15598167525'))
}

const getLatestAimEntryRequest = async (phone) => {
	const { rows } = await pool.query(`SELECT * FROM aim_entry_request WHERE account_id = (SELECT id FROM account WHERE phone='${phone}') ORDER BY created_at DESC;`)
	return rows[0]
}


const createAimEntryRequest = async (rows: any[]) => {

	let id = rows[0].account_id

	let json = rows.map((aim, i) =>  { return {"index": i + 1, "aim_id": aim.id, "aim_name": aim.name} })	
	let jsonOb = JSON.stringify(json)
	console.log('json: ', json)
	console.log('json s: ', jsonOb)

	await pool.query(`INSERT INTO aim_entry_request(id, created_at, message, account_id, date) VALUES(DEFAULT, NOW(), '${jsonOb}', '${id}', CURRENT_DATE );`)
	// aims.map(aim => {
	// 	await pool.query
	// })
}

const getUserAims = async (userId: string) => {
	// aims where id eq arg
	// gets a users aims where no entry for today has been entered
	const { rows } = await pool.query(`
		SELECT * FROM aim WHERE account_id='${userId}' 
		AND name NOT IN (SELECT  a.name FROM aim AS a 
		LEFT JOIN aim_entry as x ON x.aim_id = a.id 
		WHERE x.date = CURRENT_DATE);`)


	console.log('rows: ', rows)
	return rows	
}

// const getLatestAimEntryRequest = async (userId: string) => {
// 	// aims where id eq arg
// 	// gets a users aims where no entry for today has been entered
// 	const { rows } = await pool.query(`
// 		SELECT * FROM aim_entry_request WHERE account_id='${userId}';`)


// 	console.log(' aer rows: ', rows[0].message[0].index)
// 	return rows	
// }


const formatMessageString = (rows: any[]) => {
	let message = 'How did you do today? \n'
	rows.map((aim, i) => {
		message += `\n ${i + 1}: ${aim.name}` 
	})	

	console.log('msg: ', message)
	return message 
}

// send message:
// -- fetch aims from db
// -- parse by id, desc 
// -- enumerate and send to user, ask if completed
// -- dont worry about max length for now


// recieve message:
// -- check message for correctness
// -- fetch aims from db
// -- filter based on index in array
// -- write completion, incompletion (this could be an extra setting)
// -- confirm success or error

// get aims with entries for today:  SELECT a.id, a.name FROM aim AS a LEFT JOIN aim_entry as x ON x.aim_id = a.id WHERE x.date = CURRENT_DATE;
