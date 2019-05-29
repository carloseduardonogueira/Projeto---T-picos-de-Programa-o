const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const speechToText = new SpeechToTextV1({
    version: '2019-18-03',
    iam_apikey: 'SKMx1Gg9w_GAUME5oM-98fIKjY8MSyYb--9KSlgB1OvI',
    url: 'https://stream.watsonplatform.net/speech-to-text/api'
});
module.exports = speechToText;