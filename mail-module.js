const sgMail = require("@sendgrid/mail");
const {request} = require("express");
const mysql = require("mysql");
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mysqldb'
})
db.connect(err => {
    if(err){
        throw err
    }
    console.log('MySQL connected')
})
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
function sendgrid(body, response){
    let email = body.email
    let sql = `INSERT INTO newsletter_mails (email) VALUES ("${email}")`
    db.query(sql, err => {
        if(err) {
            throw err
        }
        console.log('Newsletter email was successfully added to database.')
    })
    let msg = {
        to: `${email}`, // Change to your recipient
        from: 'biombox@interia.pl', // Change to your verified sender
        subject: 'My Weather App Newsletter Info',
        text: 'Design of newsletter is keep working',
        html: '<strong>We keep working for newsletter mail design. Have a nice day;)</strong>',
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
    response.json(msg);
}
module.exports.sendgrid = sendgrid
