var express = require('express');
var router = express.Router();
var textToSpeech = require('../config/watsonTextToSpeech');
var fs = require('fs');

router.post('/', function (req, res, next) {
    var texto = req.body.texto;
    var synthesizeParams = {
        text: texto,
        accept: 'audio/wav',
        voice: 'pt-BR_IsabelaVoice'
    };
    console.log(synthesizeParams);
   textToSpeech.synthesize(synthesizeParams)
    .then(audio => {
        audio.pipe(fs.createWriteStream('public/audio/'+'audioWatson.wav'));
        res.send('OK');
    })
    .catch(err => {
        console.log('error:', err);
    }); 
});

module.exports = router;