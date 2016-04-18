var express = require('express');
var router = express.Router();
// import speech module with all functions
var jasper = require('../modules/jasper');
// for ajax requests
var request = require('request');

/*
 * GET Info screen
 */
router.get('/', function (req, res, next) {
    res.render('info');
});

/*
 * GET home page
 */
router.get('/ai', function (req, res, next) {
    res.render('index', {
        title: 'ai'
    });
});

/* 
 * POST: send question and get a json answer
 */
router.post('/ask', function (req, res, next) {
    // get question from request
    var question = req.body.question;
    // default answer
    var message = "How can I help you?";

    // compare request with given "key word" and act on them
    if (question == "") {
        message = "I cannot hear you. Try too speak louder";
    } else if (question.search("time") != -1) {
        message = jasper.getTime();
    } else if (question.search("weather") != -1) {
        message = jasper.getWeather();
    } else if (question.search("joke") != -1) {
        message = jasper.getRandomJoke();
    } else if (question.search("who") != -1) {
        message = jasper.whoAmI();
    } else if (question.search("life") != -1) {
        message = jasper.meaningOfLife();
    }

    var answer = {
        message: message
    };
    // send answer as an json object
    res.json(answer);
});

/*
 * Simulate weather api call
 * GET weather
 */
/*
router.get('/weather', function (req, res, next) {
    res.json({
        "coord": {
            "lon": 8.46,
            "lat": 49.49
        },
        "weather": [{
            "id": 800,
            "main": "Clear",
            "description": "clear sky",
            "icon": "01n"
        }],
        "base": "cmc stations",
        "main": {
            "temp": 280.07,
            "pressure": 1023,
            "humidity": 75,
            "temp_min": 278.15,
            "temp_max": 281.55
        },
        "wind": {
            "speed": 1.5,
            "deg": 270
        },
        "rain": {},
        "clouds": {
            "all": 0
        },
        "dt": 1461015536,
        "sys": {
            "type": 3,
            "id": 4881,
            "message": 0.0071,
            "country": "DE",
            "sunrise": 1460953553,
            "sunset": 1461003933
        },
        "id": 2873891,
        "name": "Mannheim",
        "cod": 200
    });
});
*/

module.exports = router;