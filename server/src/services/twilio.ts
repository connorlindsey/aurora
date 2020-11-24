const client =	require('twilio')(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN )

export const sendMessage = (body: string, number: string) => {
	try {
		console.log('sid: ', process.env.TWILIO_ACCOUNT_SID, 'token: ', process.env.TWILIO_AUTH_TOKEN, ', sender: ', process.env.TWILIO_VERIFIED_SENDER)
		client.messages.create({
			body,
			from: process.env.TWILIO_VERIFIED_SENDER,
			to: number
		}).then(message => {
			console.log('sendMessage response: ', message.sid)
		}).done()
	} catch (error){
		console.log('[Error] sendSMS', error)
	}
}

export const testSMS = () => {
	sendMessage('what it do', '+15598167525')
}