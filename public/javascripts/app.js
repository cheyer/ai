$(document).ready(function () {

    /*
     * text to speech configuration
     */
    var synth = window.speechSynthesis;
    var inputForm = document.querySelector('form');
    var inputTxt = "hey";
    var pitch = 1;
    var rate = 1;
    var selectedOption = "Google UK English Female";
    var voices = [];

    /* get a list of all voices and save them in the voices array */
    function populateVoiceList() {
        voices = synth.getVoices();

        for (i = 0; i < voices.length; i++) {
            var option = document.createElement('option');
            //console.log(voices[i].name + ' (' + voices[i].lang + ')');
            option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

            if (voices[i].default) {
                option.textContent += ' -- DEFAULT';
            }
            option.setAttribute('data-lang', voices[i].lang);
            option.setAttribute('data-name', voices[i].name);
        }
    }
    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }
    /*
     * END text to speech configuration
     */


    /*
     * speech to text configuration
     */
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
        // create grammar object
    var grammar = '#JSGF V1.0; grammar subjects; public <subject> = time | weather | joke | who | life;';
    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    //recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // output element for printing out recognized speech to text
    var output = document.querySelector('.output');

    // click to start recording and recognizing
    $('#submit').click(function (event) {
        // prevent leaving the page
        event.preventDefault();
        // animation effect for the button
        $('#submit').addClass('pulse');
        output.textContent = "I'm listening . . .";
        // start recognition
        recognition.start();
        console.log('Ready to receive a command.');
    });


    // after recognition call ajax
    recognition.onresult = function (event) {
        // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
        // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
        // It has a getter so it can be accessed like an array
        // The first [0] returns the SpeechRecognitionResult at position 0.
        // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
        // These also have getters so they can be accessed like arrays.
        // The second [0] returns the SpeechRecognitionAlternative at position 0.
        // We then return the transcript property of the SpeechRecognitionAlternative object 

        // get speech 2 text result
        var speech2text = event.results[0][0].transcript;
        output.textContent = "I've heard: " + speech2text + ".";
        console.log('Confidence: ' + event.results[0][0].confidence);
        // stop animation effect for button
        $('#submit').removeClass('pulse');
        // save speech 2 text result for further usage in var question
        var question = speech2text;

        /*
         * make ajax call with question as input parameter to backend
         * and do text 2 speech with the result
         */
        $.ajax({
            url: '/ask',
            data: {
                question: question
            },
            error: function () {
                $('#response').html('An error has occurred');
            },
            dataType: 'json',
            success: function (data) {
                //console.log(data);
                // show response on screen
                $('#response').html(data.message);
                // give over response message to the Web Speech API for reading it aloud
                var utterThis = new SpeechSynthesisUtterance(data.message);
                // needed to use the above specified voice
                for (i = 0; i < voices.length; i++) {
                    if (voices[i].name === selectedOption) {
                        //console.log(voices[i]);
                        utterThis.voice = voices[i];
                    }
                }
                // configuring pitch and ratels
                utterThis.pitch = pitch;
                utterThis.rate = rate;
                // speak
                synth.speak(utterThis);
            },
            type: 'POST'
        });
    }

    recognition.onspeechend = function () {
        recognition.stop();
    }

    recognition.onnomatch = function (event) {
        output.textContent = "I didnt recognise what you've said.";
    }

    recognition.onerror = function (event) {
        output.textContent = 'Error occurred in recognition: ' + event.error;
    }
});