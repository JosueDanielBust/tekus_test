'use strict';

let path = require('path');
let url = require('url');
let fs = require('fs');

let headers = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET",
    "access-control-allow-headers": "content-type, accept",
    "access-control-max-age": 10
};

function respond(res, data, status) {
    status = status || 200;
    res.writeHead(status, headers);
    res.end(data);
};

function send404(res) {
    respond(res, '404 - Not Found', 404);
};

let actions = {
    'GET': function(req, res) {
        let parsedUrl = url.parse(req.url);

        if (parsedUrl.pathname === '/') {
            let data = '';
            fs.readFile('./public/index.html', function(error, data){
                if (error) { throw error; } else {
                    respond(res, data, 200);
                }
            })
        } else if (parsedUrl.pathname === '/video') {
            respond(res, 'Video API', 200);
        } else if (parsedUrl.pathname != '/') {
            fs.stat( './public' + parsedUrl.pathname, function(error, stats) { 
                if (error) {
                    send404(res);
                } else {
                    fs.readFile( './public' + parsedUrl.pathname, function(err, data) {
                        respond(res, data, 200);
                    });
                }
            });
        }
    }
};

exports.handleRequest = function(req, res) {
    var action = actions[req.method];
    action ? action(req, res) : send404(res);
};