const express = require('express');
require("dotenv").config()
const app = express();
const bodyParser = require('body-parser')
const {loginUser, registerUser, changePassword, changeUsername, addUserToGoogleDb, addUserToFacebookDb, checkUserExistInGoogleDb,
    checkUserExistInFacebookDb, checkUsernameExistInAllDbs
} = require("./login-module");
const {getLocationId, getCityFromCoords, getGeneralWeatherInfo, getAdvancedWeatherInfo, getHourlyWeatherInfo} = require("./weather-info-module")
const {sendgrid} = require("./email-send-module");

app.listen(3000, ()=> console.log("listening in 3000"));

app.use( function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Max-Age', '600')
    next();
}, bodyParser.json());
app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));

app.post('/getHourlyWeatherInfo', (request, response ) => {
    getHourlyWeatherInfo(request.body, response)
})

app.post('/getAdvancedWeatherInfo', (request, response ) => {
    getAdvancedWeatherInfo(request.body, response)
})

app.post('/getGeneralWeatherInfo', (request, response ) => {
    getGeneralWeatherInfo(request.body, response)
})

app.post('/getCityFromCoords', (request, response) => {
    getCityFromCoords(request, response)
})

app.post('/getLocationId', (request, response ) => {
    getLocationId(request.body, response)
})

app.post('/checkUsernameExistInAllDbs', (request, response ) => {
    checkUsernameExistInAllDbs(request.body, response)
})

app.post('/checkUserExistInFacebookDb', (request, response ) => {
    checkUserExistInFacebookDb(request.body, response)
})

app.post('/checkUserExistInGoogleDb', (request, response ) => {
    checkUserExistInGoogleDb(request.body, response)
})

app.post('/addUserToFacebookDb', (request, response ) => {
    addUserToFacebookDb(request.body, response)
})

app.post('/addUserToGoogleDb', (request, response ) => {
    addUserToGoogleDb(request.body, response)
})

app.post('/changeUsername', (request, response ) => {
    changeUsername(request.body, response)
})

app.post('/changePassword', (request, response ) => {
    changePassword(request.body, response)
})

app.post('/loginUser', (request, response ) => {
    loginUser(request.body, response)
})

app.post('/registerUser', (request, response) => {
    registerUser(request.body, response)
})

app.post('/sendgrid', (request, response) => {
    sendgrid(request.body, response)
});
