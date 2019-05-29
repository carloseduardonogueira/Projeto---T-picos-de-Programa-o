const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
const textToSpeech = new TextToSpeechV1({
    version: '2019-18-03',
    iam_apikey: 'CTlhof5JQGWw9cL2ZFqFtcTQKXlQ6yGMlCIB1q2nySi1',
    url: 'https://stream.watsonplatform.net/text-to-speech/api'
});
module.exports = textToSpeech;