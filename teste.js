var express = require('express');
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient({
    keyFilename: 'APIKey.json'
});

client
.textDetection('./public/images/imagem1.jpeg')
.then(results => {
const result = results[0].textAnnotations;

console.log(`Text Annotations Result: ${JSON.stringify(result, null, 2)}`);
})
.catch(err => {
console.error('ERROR:', err);
});