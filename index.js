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
    var stream = fs.createWriteStream('l.mp3');
    

    var link = req.query.link.trim();
    var name = randomstring.generate() + ".mp3";
    let stream = ytdl(link, {
      quality: 'highestaudio',
      //filter: 'audioonly',
    });
    var id = "l";
    let start = Date.now();
    res.setHeader("content-type", "audio/mp3");
    ffmpeg(stream)
      .output(res)
      .audioBitrate(128)
       .on('progress', (p) => {
       console.log(`${p.targetSize}kb downloaded`);
       fs.createReadStream("l.mp3")
      })
      .on('end', () => {
        console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
    }).pipe(stream, {end:true});
    
    
    
});

app.listen(port);