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
        let stream = ytdl(results[0].link, {
            quality: 'highestaudio',
            //filter: 'audioonly',
          });
          ffmpeg(stream)
          .audioBitrate(128)
          .save(`nwa.mp3`)
          .on('progress', (p) => {
           process.stdout.write(`${p.targetSize}kb downloaded`);
          })
          .on('end', () => {
            console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
            res.send(results);
        });
       
      });
      
});

app.listen(port);