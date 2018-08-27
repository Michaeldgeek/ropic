var express = require('express');
var config = require('./config');
var compression = require('compression');
var port = process.env.PORT || config.PORT;
var app = express();
var fs = require('fs');
var search = require('youtube-search');
const ytdl = require('ytdl-core');
const readline = require('linebyline');
const ffmpeg = require('fluent-ffmpeg');

app.use(compression());

app.get('/', function(req, res) {
    
        res.send("results");
    
      
});

app.listen(port)