const express = require('express');
const Datastore = require('nedb')
const axios = require("axios");
const mysql = require('mysql');

//Create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dasdasdas'

})
db.connect(err => {
    if(err){
        throw err
    }
    console.log('MySQL connected')
})
const app = express();

const bodyParser = require('body-parser')


const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.listen(3000, ()=> console.log("listening in 3000"));

app.use( function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', '*');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    //Off preflight request.
    res.setHeader('Access-Control-Max-Age', '600')

    next();
}, bodyParser.json());
app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));


app.post('/getHourlyWeatherInfo', (request, response ) => {
    console.log(request.body.id, "chuj")
    const options = {
        method: 'GET',
        url: `https://foreca-weather.p.rapidapi.com/forecast/hourly/${request.body.id}`,
        params: {
            alt: '0',
            tempunit: 'C',
            windunit: 'MS',
            tz: 'Europe/London',
            periods: '8',
            dataset: 'full',
            history: '0'
        },
        headers: {
            'X-RapidAPI-Key': '9b4b75c0cfmsh491193c70f6ebf2p1c8211jsn4e60f1866731',
            'X-RapidAPI-Host': 'foreca-weather.p.rapidapi.com'
        }
    };
    console.log('Got request from hourly weather info');
    let data = axios.request(options).then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.error(error);
    });
    data.then(function(result) {
        console.log(result)
        response.json(result)
    })
})
app.post('/getAdvancedWeatherInfo', (request, response ) => {
    console.log(request.body.id, "chuj")
    const options = {
        method: 'GET',
        url: `https://foreca-weather.p.rapidapi.com/forecast/daily/${request.body.id}`,
        params: {alt: '0', tempunit: 'C', windunit: 'KMH', periods: '12', dataset: 'full'},
        headers: {
            'X-RapidAPI-Key': '9b4b75c0cfmsh491193c70f6ebf2p1c8211jsn4e60f1866731',
            'X-RapidAPI-Host': 'foreca-weather.p.rapidapi.com'
        }
    };
    console.log('Got request for advanced weather info');
    let data = axios.request(options).then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.error(error);
    });
    data.then(function(result) {
        console.log(result)
        response.json(result)
    })
})
app.post('/getGeneralWeatherInfo', (request, response ) => {
    console.log(request.body.id, "chuj")
    const options = {
        method: 'GET',
        url: `https://foreca-weather.p.rapidapi.com/current/${request.body.id}`,
        params: {alt: '0', tempunit: 'C', windunit: 'KMH', tz: 'Europe/London', lang: 'en'},
        headers: {
            'X-RapidAPI-Key': '9b4b75c0cfmsh491193c70f6ebf2p1c8211jsn4e60f1866731',
            'X-RapidAPI-Host': 'foreca-weather.p.rapidapi.com'
        }
    };
    console.log('Got request for general weather info');
    let data = axios.request(options).then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.error(error);
    });
    data.then(function(result) {
        console.log(result)
        response.json(result)
    })
})
app.post('/getCityFromCoords', (request, response) => {
    const options = {
        method: 'GET',
        url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${request.lat}&longitude=${request.lon}&localityLanguage=en`,
    };
    let data = axios.request(options).then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.error(error);
    });
    data.then(function(result) {
        console.log(result)
        response.json(result)
    })
})
app.post('/getLocationId', (request, response ) => {
    console.log(request.body.city, "2")
    const options = {
        method: 'GET',
        url: `https://foreca-weather.p.rapidapi.com/location/search/${request.body.city}`,
        headers: {
            'X-RapidAPI-Key': '9b4b75c0cfmsh491193c70f6ebf2p1c8211jsn4e60f1866731',
            'X-RapidAPI-Host': 'foreca-weather.p.rapidapi.com'
        }
    };

    let data = axios.request(options).then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.error(error);
    });
    data.then(function(result) {
        console.log(result)
        response.json(result)
    })
})
app.post('/checkUsernameExistInAllDbs', (request, response ) => {
    let username = request.body.username
    let sql = `SELECT EXISTS(SELECT * FROM users WHERE username = "${username}" LIMIT 0,1)`
    db.query(sql, function(err, result) {
        const res = Object.values(JSON.parse(JSON.stringify(result)));
        let queryResult = Object.values(res[0])[0];
        console.log(queryResult)
        if(queryResult === 0){
            let sql = `SELECT EXISTS(SELECT * FROM users_facebook WHERE username = "${username}" LIMIT 0,1)`
            db.query(sql, function(err, result) {
                const res = Object.values(JSON.parse(JSON.stringify(result)));
                let queryResult = Object.values(res[0])[0];
                console.log(queryResult)
                if(queryResult === 0){
                    let sql = `SELECT EXISTS(SELECT * FROM users_google WHERE username = "${username}" LIMIT 0,1)`
                    db.query(sql, function(err, result) {
                        const res = Object.values(JSON.parse(JSON.stringify(result)));
                        let queryResult = Object.values(res[0])[0];
                        if(queryResult === 0){
                            response.json(true)
                            console.log("Username does not exist in any database.")
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
})
app.post('/checkUserExistInFacebookDb', (request, response ) => {
    let email = request.body.email
    let sql = `SELECT EXISTS(SELECT * FROM users_facebook WHERE email = "${email}" LIMIT 0,1)`
    db.query(sql, function(err, result) {
        const res = Object.values(JSON.parse(JSON.stringify(result)));
        let queryResult = Object.values(res[0])[0];
        console.log(queryResult)
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
})
app.post('/checkUserExistInGoogleDb', (request, response ) => {
    let email = request.body.email
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
})
app.post('/addUserToFacebookDb', (request, response ) => {
    console.log(request.body, "2")
    let user = request.body
    let sql = `INSERT INTO users_facebook (userId, username, email, firstName, lastName) VALUES ("${user.userId}",
    "${user.username}", "${user.email}", "${user.firstName}","${user.lastName}")`
    db.query(sql, function(err, result) {
        if(err) {
            throw err
        }
        console.log('User was added to facebook database.')
        response.json(user)
    })
})
app.post('/addUserToGoogleDb', (request, response ) => {
    console.log(request.body, "2")
    let user = request.body
    let sql = `INSERT INTO users_google (email, username) VALUES ("${user.email}","${user.username}")`
    db.query(sql, function(err, result) {
        if(err) {
            throw err
        }
        console.log('User was added to google database.')
        response.json(user)
    })
})
app.post('/changeUsername', (request, response ) => {
    let username = request.body.username
    let oldUsername = request.body.oldUsername
    let database = request.body.database
    console.log(username, oldUsername)
    let sql = `UPDATE ${database} SET username="${username}" WHERE username = "${oldUsername}";`
    db.query(sql, function(err, result) {
        if(err) {
            throw err
        }
        response.json({condition: true})
        console.log("Username updated successfully")
    })
})
app.post('/changePassword', (request, response ) => {
    let username = request.body.username
    let password = request.body.password
    console.log(username, password)
    let sql = `UPDATE users SET password="${password}" WHERE username = "${username}";`
    db.query(sql, function(err, result) {
        if(err) {
            throw err
        }
        response.json({condition: true})
        console.log("Password has changed successfully")
    })
})
app.post('/loginUser', (request, response ) => {
    let user = request.body
    let sql = `SELECT EXISTS(SELECT * FROM users WHERE username = "${user.username}" AND password = "${user.password}" LIMIT 0,1)`
    db.query(sql, function(err, result) {
        if(err) {
            throw err
        }
        const res = Object.values(JSON.parse(JSON.stringify(result)));
        let queryResult = Object.values(res[0])[0];
        console.log(queryResult)
        if(queryResult === 1){
            console.log("Login successfully.")
            response.json(user)
        }
        else{
            console.log("Login failed.")
            response.status(401).send();
        }
    })
})
app.post('/registerUser', (request, response) => {
    let user = request.body
    let sql = `SELECT EXISTS(SELECT * FROM users WHERE username = "${user.username}" OR email = "${user.email}")`
    db.query(sql, function(err, result) {
        if(err) {
            throw err
        }
        // console.log(Object.values(JSON.parse(JSON.stringify(result)))[0].constructor.name, fields)
        const res = Object.values(JSON.parse(JSON.stringify(result)));
        let queryResult = Object.values(res[0])[0];
        if(queryResult === 0){
            let sql = `INSERT INTO users (username ,email, password) VALUES ("${user.username}","${user.email}", "${user.password}")`
            db.query(sql, err => {
                if(err) {
                    throw err
                }
                console.log('User was added to database.')
                response.json(user)
            })
        }
        else{
            response.status(409).send();
        }
    })
})
app.post('/sendgrid', (request, response) => {
    console.log(request.body.email)
    let email = request.body.email
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
});


