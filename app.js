'use strict';

console.time('Runtime');

let fs = require('fs');
let http = require('http');
let request = require('request');
var progress = require('request-progress');

// Routes of application
let router = require('./router');

// This array is an Array of Arrays object
// Each element of the array has a name and his play time on seconds
// [filename, time]
let media = [['Arkbox.mp4', 0], ['Cronometro.mp4', 60], ['Tekus_BG1.jpg', 5], ['Tekus_BG2.jpg', 10]];

// Control vars of downloads
let downloadedFiles = 0;

function downloadSingleFile(file) {
    return new Promise( function(resolve, reject) {
        fs.stat('./public/Media/' + file, function(error, stats) { 
            if (error) {
                progress(request('http://cdn.tekus.co/Media/' + file), {
                    throttle: 2000,
                    delay: 0
                })
                .on('progress', function (state) {
                    let progressString = '(' + (state.percent*100).toFixed(2) + '% / ' + downloadedFiles + ' de ' + media.length + ')';
                    console.log(progressString);
                })
                .on('error', function (err) { throw error; })
                .on('end', function () {
                    console.log(file + " downloaded");
                    downloadedFiles++;
                    return resolve('');
                })
                .pipe(fs.createWriteStream('./public/Media/' + file));
            } else {
                console.log(file + " exists");
                downloadedFiles++;
                return resolve('');
            }
        });
    });
}

function downloadFiles(files) {
    return new Promise( function(resolve, reject) {
        return Promise.all(files.map( function(file) { return downloadSingleFile(file[0]); })).then(
            values => { return files },
            error => { console.log(error); }
        );
    });
}

function playFiles(files) {
    //
}

downloadFiles(media)
    //.then(playFiles)
    .then(result => {
        console.timeEnd('Runtime');
        console.log('=> Check your folder...');
    })
    .catch(error => { throw error; });

let port = 3000;
let ip = '127.0.0.1';
let server = http.createServer(router.handleRequest);

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);