var express = require('express');
var config = require('./config');
var compression = require('compression');
var port = process.env.PORT || config.PORT;
var app = express();
var fs = require('fs');
var search = require('youtube-search');
const ytdl = require('ytdl-core');
var bodyParser = require('body-parser');
const readline = require('linebyline');
const ffmpeg = require('fluent-ffmpeg');
var randomstring = require("randomstring");

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
   res.send("Server is up and running");
      
});

app.get('/get-songs', function(req, res) {
  var opts = {
      maxResults: 10,
      key: config.YT_KEY
    };
    var query = req.query.q.trim();
    search(query, opts, function(err, results) {
      if(err) return console.log(err);
      res.send(results);
    });
    
});

app.get('/download-song', function(req, res) {
  var opts = {
      maxResults: 10,
      key: config.YT_KEY
    };
    var link = req.query.link.trim();
    var name = randomstring.generate() + ".mp3";
    let stream = ytdl(link, {
      quality: 'highestaudio',
      //filter: 'audioonly',
    });
    ffmpeg(stream)
    .audioBitrate(128)
    .save(name)
    .on('progress', (p) => {
     //process.stdout.write(`${p.targetSize}kb downloaded`);
    })
    .on('end', () => {
      console.log("done");
     res.sendFile(__dirname + "/" + name, function(err) {
      if(!err) {
        fs.unlinkSync(__dirname + "/" + name);
      }
     });
  });
 
    
});

app.listen(port);