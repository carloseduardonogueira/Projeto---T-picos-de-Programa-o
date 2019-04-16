var express = require('express');
var router = express.Router();
var client = require('../config/cloudVision');

router.post('/', function (req, res, next) {
    client
        .textDetection('../public/images/image.png')
        .then(results => {
        const result = results[0].textAnnotations;
 
        console.log(`Text Annotations Result: ${JSON.stringify(result, null, 2)}`);
    })
    .catch(err => {
        console.error('ERROR:', err);
    });
});
module.exports = router;