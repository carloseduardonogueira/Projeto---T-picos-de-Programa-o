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

router.post('/upload', upload.single('uploads'), function (req, res) {  
    var currentFile = req.file.path;
    console.log("Image path: " + req.file.path);
    res.send("Ok");
});

module.exports = router;