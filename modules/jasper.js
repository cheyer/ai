var request = require('request');
/*
 * list of all functions provided
 * function must return String, this will be spoken by the Web Speech API
 */
module.exports = {
    getRandomJoke: function () {
        var jokes = [
            "If at first you don't succeed, skydiving is not for you! Ok, that's kinda black.",
            "The last thing I want to do is hurt you. But it's still on the list. Haha",
            "I used to be indecisive. Now I'm not sure."
        ];
        var index = Math.floor(Math.random() * jokes.length);
        return jokes[index];
    },

    getTime: function () {
        var d = new Date();
        var hour = d.getHours();
        var min = d.getMinutes();
        if (min < 10) {
            min = "0" + min;
        }
        if (hour < 10) {
            hour = "0" + hour;
        }
        return "I love that question. Now it's " + hour + ":" + min + ".";
    },

    getWeather: function () {
        return "Let me see. Todays weather should be okay!";
    },
    whoAmI: function () {
        return "My name is ai. I'm created by chichi and I'm not very useful yet. Cheers!"
    },
    meaningOfLife: function () {
        return "I don’t think there is a specific meaning of life. Everyone has a different meaning, they just have to find it. Else try 42.";
    }
    /*
     * TODO weather
     */
    /*
    weatherInMannheim: function () {
        var answer;
        request('http://localhost:3000/weather', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                answer = body;
                console.log(body); // Print the body of response.
            }
        });
        return answer;
    }
    */
};