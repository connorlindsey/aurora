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

export const recieveMessage = (data) => {
	console.log('recieveMessage: ', data)
}

export const testSMS = async () => {
	// sendMessage('what it do', '+15598167525')
	let aims = await getUserAims('1')
	let message = formatMessageString(aims)
	sendMessage(message, '+15598167525')
}

const getUserAims = async (userId: string) => {
	// aims where id eq arg
	const { rows } = await pool.query(`SELECT * FROM aim WHERE account_id='${userId}' ORDER BY id ASC; `)
	console.log('rows: ', rows)
	return rows	
}

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