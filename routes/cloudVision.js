var express = require('express');
var router = express.Router();
var client = require('../config/cloudVision');

// Setting up multer to upload images
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.jpg') //Appending .jpg
    }
  });
var upload = multer({ storage: storage });

router.post('/', upload.single('public/images'), function (req, res) {
    var currentFile = req.file.path; 
    client
        .textDetection(currentFile)
        .then(results => {
        var result = results[0].textAnnotations;
        console.log(result[0].description);
        //console.log(`Text Annotations Result: ${JSON.stringify(result, null, 2)}`);
        res.json({status: 'OK', data:result[0].description});
    })
    .catch(err => {
        console.error('ERROR:', err);
    });
});

module.exports = router;