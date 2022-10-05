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

function loginUser(body, response){
    let user = body
    let sql = `SELECT EXISTS(SELECT * FROM users WHERE username = "${user.username}" AND password = "${user.password}" LIMIT 0,1)`
    db.query(sql, function(err, result) {
        if(err) {
            throw err
        }
        const res = Object.values(JSON.parse(JSON.stringify(result)));
        let queryResult = Object.values(res[0])[0];
        if(queryResult === 1){
            console.log("Login successfully.")
            response.json(user)
        }
        else{
            console.log("Login failed.")
            response.status(401).send();
        }
    })
}
module.exports.loginUser = loginUser

function registerUser(body, response){
    let user = body
    let sql = `SELECT EXISTS(SELECT * FROM users WHERE username = "${user.username}" OR email = "${user.email}")`
    db.query(sql, function(err, result) {
        if (err) {
            throw err
        }
        const res = Object.values(JSON.parse(JSON.stringify(result)));
        let queryResult = Object.values(res[0])[0];
        if (queryResult === 0) {
            let sql = `INSERT INTO users (username ,email, password) VALUES ("${user.username}","${user.email}", "${user.password}")`
            db.query(sql, err => {
                if(err) {
                    throw err
                }
                console.log('User was added to database.')
                response.json(true)
            })
        }
        else{
            response.json(false)
            console.log("Cannot registry user.")
        }
    })
}
module.exports.registerUser = registerUser

function changePassword(body, response){
    let username = body.username
    let password = body.password
    let sql = `SELECT password FROM users WHERE username = "${username}"`
    db.query(sql, function(err, result) {
        if (err) {
            throw err
        }
        const res = Object.values(JSON.parse(JSON.stringify(result)));
        let queryResult = Object.values(res[0])[0];
        if(queryResult === password){
            response.json({ message: "Cannot change for actually account password." })
            console.log("Cannot change for actually account password.")
        }
        else {
            let sql = `SELECT EXISTS(SELECT * FROM users WHERE username = "${username}")`
            db.query(sql, function(err, result) {
                if (err) {
                    throw err
                }
                const res = Object.values(JSON.parse(JSON.stringify(result)));
                let queryResult = Object.values(res[0])[0];
                if (queryResult === 1) {
                    let sql = `UPDATE users SET password="${password}" WHERE username = "${username}";`
                    db.query(sql, function (err, result) {
                        if (err) {
                            throw err
                        }
                        response.json({condition: true})
                        console.log("Password has changed successfully")
                    })
                } else {
                    response.json({condition: false})
                    console.log("Cannot change password user does not exist.")
                }
            })
        }
    })
}
module.exports.changePassword = changePassword

function changeUsername(body, response){
    let username = body.username
    let oldUsername = body.oldUsername
    let database = body.database
    console.log(username, oldUsername)
    let sql = `UPDATE ${database} SET username="${username}" WHERE username = "${oldUsername}";`
    db.query(sql, function(err, result) {
        if(err) {
            throw err
        }
        response.json({condition: true})
        console.log("Username updated successfully")
    })
}
module.exports.changeUsername = changeUsername

function addUserToGoogleDb(body, response){
    console.log(body)
    let user = body
    let sql = `INSERT INTO users_google (email, username) VALUES ("${user.email}","${user.username}")`
    db.query(sql, function(err, result) {
        if(err) {
            throw err
        }
        console.log('User was added to google database.')
        response.json(user)
    })
}
module.exports.addUserToGoogleDb = addUserToGoogleDb

function addUserToFacebookDb(body, response){
    let user = body
    let sql = `INSERT INTO users_facebook (userId, username, email, firstName, lastName) VALUES ("${user.userId}",
    "${user.username}", "${user.email}", "${user.firstName}","${user.lastName}")`
    db.query(sql, function(err, result) {
        if(err) {
            throw err
        }
        console.log('User was added to facebook database.')
        response.json(user)
    })
}
module.exports.addUserToFacebookDb = addUserToFacebookDb

function checkUserExistInGoogleDb(body, response){
    let email = body.email
    let sql = `SELECT EXISTS(SELECT * FROM users_google WHERE email = "${email}" LIMIT 0,1)`
    db.query(sql, function(err, result) {
        const res = Object.values(JSON.parse(JSON.stringify(result)));
        let queryResult = Object.values(res[0])[0];
        console.log(queryResult)
        if(queryResult === 0){
            console.log("Username does not exist in google Db.")
            response.json({condition: false})
        }
        else{
            let sql = `SELECT username FROM users_google WHERE email = "${email}"`
            db.query(sql, function(err, result) {
                const res = Object.values(JSON.parse(JSON.stringify(result)));
                let queryResult = Object.values(res[0])[0];
                response.json({condition: true, username: queryResult})
                console.log({condition: true, username: queryResult})
            })
            console.log("User exist in google Db.")
        }
    })
}
module.exports.checkUserExistInGoogleDb = checkUserExistInGoogleDb

function checkUserExistInFacebookDb(body, response){
    let email = body.email
    let sql = `SELECT EXISTS(SELECT * FROM users_facebook WHERE email = "${email}" LIMIT 0,1)`
    db.query(sql, function(err, result) {
        const res = Object.values(JSON.parse(JSON.stringify(result)));
        let queryResult = Object.values(res[0])[0];
        if(queryResult === 0){
            console.log("Username does not exist in facebook Db.")
            response.json({condition: false})
        }
        else{
            let sql = `SELECT username FROM users_facebook WHERE email = "${email}"`
            db.query(sql, function(err, result) {
                const res = Object.values(JSON.parse(JSON.stringify(result)));
                let queryResult = Object.values(res[0])[0];

                response.json({condition: true, username: queryResult})
            })
            console.log("User exist in facebook Db.")

        }
    })
}
module.exports.checkUserExistInFacebookDb = checkUserExistInFacebookDb

function checkUsernameExistInAllDbs(body, response){
    let username = body.username
    let sql = `SELECT EXISTS(SELECT * FROM users WHERE username = "${username}" LIMIT 0,1)`
    db.query(sql, function(err, result) {
        const res = Object.values(JSON.parse(JSON.stringify(result)));
        let queryResult = Object.values(res[0])[0];
        if(queryResult === 0){
            let sql = `SELECT EXISTS(SELECT * FROM users_facebook WHERE username = "${username}" LIMIT 0,1)`
            db.query(sql, function(err, result) {
                const res = Object.values(JSON.parse(JSON.stringify(result)));
                let queryResult = Object.values(res[0])[0];
                if(queryResult === 0){
                    let sql = `SELECT EXISTS(SELECT * FROM users_google WHERE username = "${username}" LIMIT 0,1)`
                    db.query(sql, function(err, result) {
                        const res = Object.values(JSON.parse(JSON.stringify(result)));
                        let queryResult = Object.values(res[0])[0];
                        if(queryResult === 0){
                            response.json(true)
                            console.log("Username is ready to use.")
                        }
                        else{
                            console.log("Username exist in some database.")
                            response.json(false)
                        }
                    })
                }
                else{
                    console.log("Username exist in some database.")
                    response.json(false)
                }
            })
        }
        else{
            console.log("Username exist in some database.")
            response.json(false)
        }
    })
}
module.exports.checkUsernameExistInAllDbs = checkUsernameExistInAllDbs