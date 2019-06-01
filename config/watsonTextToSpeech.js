const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
const textToSpeech = new TextToSpeechV1({
    iam_apikey: 'AH4_tjPHfbxeljUgJD1VrrsxFnyWTU3W57cdEPCwgA4Y',
    url: 'https://stream.watsonplatform.net/text-to-speech/api'
}); 

module.exports = textToSpeech;