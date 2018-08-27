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
    var opts = {
        maxResults: 10,
        key: config.YT_KEY
      };
       
      search('nwa baby', opts, function(err, results) {
        if(err) return console.log(err);
        
        res.send(results);
      });
      
});

app.listen(port)