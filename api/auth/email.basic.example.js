const path = require("path");
require('dotenv').config({path: path.join(__dirname,".env") })
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

async function main(){
    const result = await sgMail.send({
        to:'a.bakhteyev@gmail.com',
        from:'weblab4u@gmail.com',
        subject:"test Sengrid",
        html:"<p>Hello SendGrid Emailing </p>",
    });

    console.log(result);
}

main();