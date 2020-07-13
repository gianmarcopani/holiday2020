var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var nodemailer = require('nodemailer');

function inviaEmailLocatore(emailLocatore, oggetto, corpo) {
	sendEmail(emailLocatore, oggetto, corpo);
}

function inviaEmailAffittuario(emailAffittuario, oggetto, corpo) {
	sendEmail(emailAffittuario, oggetto, corpo);
}

function inviaEmailQuestura(emailLocatore, oggetto, corpo) {
	sendEmail2(emailLocatore, oggetto, corpo);
}

function inviaEmailUfficioTurismo(emailLocatore, oggetto, corpo) {
	sendEmail(emailLocatore, oggetto, corpo);
}

function sendEmail(emailDest, oggetto, corpo) {
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'progwebemobile@gmail.com',
			pass: '12321343'
		}
	});

	var mailOptions;

	mailOptions = {
		from: 'progwebemobile@gmail.com',
			to: emailDest,
			subject: oggetto,
			html: corpo,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		}

		else {
			console.log('Email sent: ' + info.response);
		}
	});

}

function sendEmail2(emailDest, oggetto, corpo) {
	const testFolder = './uploads/';
	const fs = require('fs');
	var doc;

	fs.readdirSync(testFolder).forEach(file => {
		doc=file;
	});

	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'progwebemobile@gmail.com',
			pass: '12321343'
		}
	});

	var mailOptions;

	mailOptions = {
		from: 'progwebemobile@gmail.com',
			to: emailDest,
			subject: oggetto,
			html: corpo,
			attachments: [
				{
					path: './uploads/'+doc,
					contentType: "application/pdf"
				}
			]
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		}

		else {
			console.log('Email sent: ' + info.response);
			
			fs.unlink('./uploads/'+doc, (err) => {
				if (err) {
				console.error(err)
				return
				}
				//pdf rimosso.
			}); 
		}
	});
}

module.exports={
  //sendEmailPdf: sendEmailPdf
  inviaEmailLocatore:inviaEmailLocatore,
  inviaEmailAffittuario:inviaEmailAffittuario,
  inviaEmailQuestura:inviaEmailQuestura,
  inviaEmailUfficioTurismo:inviaEmailUfficioTurismo
};