const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
const textToSpeech = new TextToSpeechV1({
    iam_apikey: 'foBsC4OhCzs2i71afeYtcXMD8v4syDXEzxD_LOYS2GHJ',
    url: 'https://stream.watsonplatform.net/text-to-speech/api'
}); 

module.exports = textToSpeech;