const { pipeline } = require('stream');
const { promisify } = require('util');
const bodyParser = require('body-parser')

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var Busboy = require('busboy');

var app = express();

const pipelineAsync = promisify(pipeline);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.post('/', async (req, res, next) => {
    
    var busboy = new Busboy({ headers: req.headers });
    
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      file.on('data', function(data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
      });
      file.on('end', function() {
        console.log('File [' + fieldname + '] Finished');
      });
      file.on('finish', function(){

      });
    });

    await pipelineAsync(
        req,
        busboy
    )
});

module.exports = app;
