const axios = require("axios");
const WEATHER_KEY = process.env.WEATHER_KEY
function getLocationId(body, response){
    console.log(body.city)
    const options = {
        method: 'GET',
        url: `https://foreca-weather.p.rapidapi.com/location/search/${body.city.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`,
        headers: {
            'X-RapidAPI-Key': WEATHER_KEY,
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
}
module.exports.getLocationId = getLocationId

function getCityFromCoords(body, response){
    const options = {
        method: 'GET',
        url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${body.lat}&longitude=${body.lon}&localityLanguage=en`,
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
}
module.exports.getCityFromCoords = getCityFromCoords

function getGeneralWeatherInfo(body, response){
    const options = {
        method: 'GET',
        url: `https://foreca-weather.p.rapidapi.com/current/${body.id}`,
        params: {alt: '0', tempunit: 'C', windunit: 'KMH', tz: 'Europe/London', lang: 'en'},
        headers: {
            'X-RapidAPI-Key': WEATHER_KEY,
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
}
module.exports.getGeneralWeatherInfo = getGeneralWeatherInfo

function getAdvancedWeatherInfo(body, response){
    const options = {
        method: 'GET',
        url: `https://foreca-weather.p.rapidapi.com/forecast/daily/${body.id}`,
        params: {alt: '0', tempunit: 'C', windunit: 'KMH', periods: '12', dataset: 'full'},
        headers: {
            'X-RapidAPI-Key': WEATHER_KEY,
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
}
module.exports.getAdvancedWeatherInfo = getAdvancedWeatherInfo

function getHourlyWeatherInfo(body, response){
    const options = {
        method: 'GET',
        url: `https://foreca-weather.p.rapidapi.com/forecast/hourly/${body.id}`,
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
            'X-RapidAPI-Key': WEATHER_KEY,
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
}
module.exports.getHourlyWeatherInfo = getHourlyWeatherInfo
