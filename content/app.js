var express = require('express');
var app = express();
//var session = require('express-session');
//var redisCli = require('redis').createClient();
//var redisStore = require('connect-redis')(session);
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var File = require('./model/File');

mongoose.connect('mongodb://localhost/webeditor', function(err) {
  if (err) {
    console.error('Unable to connect to mongoDB: ', err);
    process.exit(1);
  }
});

const CONTENT_TYPE = {
    'html': 'text/html',
    'css': 'text/css',
    'javascript': 'application/javascript'
}

const normalizePath = function(req, res, next) {
    req.params.path = req.params['0'];
    if (req.params.path.includes('//') || req.params.path === '/') {
        // malformed
        return next({status: 400, message: 'Malformed file path'})
    }
    req.params.path = req.params.path.endsWith('/') ? req.params.path.slice(0,-1) : req.params.path;
    req.params.path = req.params.path.startsWith('/') ? req.params.path.slice(1) : req.params.path;
    req.params.path = '/'.concat(req.params.path);
    next();
};

app.get('/staticcontent/user/:username/projects/:project/*', normalizePath, function(req, res, next) {
    var path = req.params.path === '/' ? '/index.html' : req.params.path;
    File.findOne({ project_name: req.params.project, creator: req.params.username, path, node_type: 'F'}, (err, file) => {
        if (err || !file) return next(err);
        var type = CONTENT_TYPE[file.file_type];
        if (!type) return next('Bad type');
        res.set('Content-Type', type);
        res.end(file.contents);
    });
});

app.use((err, req, res, next) => {
    res.json(err);
});

app.listen(8084, function () {
  console.log('Example app listening on port 8083!')
});