'use strict';

console.time('Runtime');

let fs = require('fs');
let request = require('request');
var progress = require('request-progress');

let media = [['Arkbox.mp4', 0], ['Cronometro.mp4', 60], ['Tekus_BG1.jpg', 5], ['Tekus_BG2.jpg', 10]]

function downloadSingleFile(file) {
    return new Promise( function(resolve, reject) {
        fs.stat(file, function(error, stats) { 
            if(error){
                
                let fileStream = fs.createWriteStream(file);
                request('http://cdn.tekus.co/Media/' + file).on('response', function(data) {
                    console.log( data.headers[ 'content-length' ] );
                }).pipe(fileStream).on('finish', function() {
                    console.log(file + " downloaded");
                    return resolve('');
                });

            } else {
                console.log(file + " exists");
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
