'use strict';

console.time('Runtime');

let fs = require('fs');
let request = require('request');
var progress = require('request-progress');

// This array is an Array of Arrays object
// Each element of the array has a name and his play time
// [filename, time]
let media = [['Arkbox.mp4', 0], ['Cronometro.mp4', 60], ['Tekus_BG1.jpg', 5], ['Tekus_BG2.jpg', 10]]

function downloadSingleFile(file) {
    return new Promise( function(resolve, reject) {
        fs.stat('./Media/' + file, function(error, stats) { 
            if(error){
                progress(request('http://cdn.tekus.co/Media/' + file), {
                    throttle: 1000,
                    delay: 0
                })
                .on('progress', function (state) { console.log('progress', state.percent); })
                .on('error', function (err) { throw error; })
                .on('end', function () {
                    console.log(file + " downloaded");
                    return resolve('');
                })
                .pipe(fs.createWriteStream('./Media/' + file));
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
