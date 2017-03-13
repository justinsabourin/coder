var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var redisCli = require('redis').createClient();
var redisStore = require('connect-redis')(session);
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Project = require('./model/Project');
var File = require('./model/File');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    store: new redisStore({
      host: 'localhost',
      port: 6379,
      client: redisCli,
      ttl: 260,
    }),
    saveUninitialized: true,
}));

// connect to mongodb
mongoose.connect('mongodb://localhost/webeditor', function(err) {
  if (err) {
    console.error('Unable to connect to mongoDB: ', err);
    process.exit(1);
  }
});


app.use(function(req, res, next) {
    req.user = req.session.passport.user;
    if (!req.user) return next({status: 401, message: "Unauthorized"});
    if (req.params.username && req.user.username !== req.params.username)
        return next({status: 401, message: "Unauthorized"});
    next();
});

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

// Create project
app.post('/api/projects/user/:username/projects/', function(req, res, next) {
    var newProject = new Project({
        creator: req.params.username,
        project_name: req.body.project_name
    });
    newProject.save((err) => {
        console.log(err);
        if (err) return next(err);
        return res.json(newProject.rest());
    });
});

// Get project
app.get('/api/projects/user/:username/projects/:project', function(req, res, next) {
    Project.findOne({ creator: req.params.username, project_name: req.params.project }, (err, project) => {
        if (err) return next({status: 500, message: err.message});
        if (!project) return next({status: 404, message: 'Project doesnt exist'});
        project.getTreeStructure((err, tree) => {
            if (err) return next({status: 500, message: err.message});
            console.log(tree);
            res.json(tree);
        });
    });
});

app.get('/api/projects/user/:username/projects', function(req, res, next) {
    Project.getProjects(req.user.username, function(err, projects) {
        if (err) return next({status: 500, message: err.message});
        res.json(projects);
    });
});

// Create file for project
app.post('/api/projects/user/:username/projects/:project/*', normalizePath, function(req, res, next) {
    Project.findOne( { creator: req.params.username, project_name: req.params.project }, (err, project) => {
        if (err) return next({status: 500, message: err.message});
        if (!project) return next({status: 404, message: 'Project doesnt exist'});
        project.addFile(req.params.path, req.body.contents, req.body.type, function(err, newFile) {
            console.log(err);
            if (err) return next({status: 500, message: err.message});
            res.json(newFile.rest());
        });
    });


    
});

// update file for project
app.patch('/api/projects/user/:username/projects/:project/*', normalizePath, function(req, res, next) {
    Project.updateFile(req.params.project, req.params.username, req.params.path, req.body.contents, function(err, updatedFile) {
        if (err) return next({status: 500, message: err.message});
        console.log(updatedFile);
        res.json(updatedFile.rest());
    });
});

// Read file for project
app.get('/api/projects/user/:username/projects/:project/*', normalizePath, function(req, res, next) {
    Project.getFile(req.params.project, req.params.username, req.params.path, function(err, file) {
        if (err) return next({status: 500, message: err.message});
        if (!file) return next({status: 404, message: "File doesnt exist"});
        res.json(file.rest());
    });
});

// Delete file for project
app.delete('/api/projects/user/:username/projects/:project/*', normalizePath, function(req, res, next) {
    return;
});

app.use(function (err, req, res, next) {
    if (err.status) {
        res.status(err.status).end(err.message);
    } else {
        return next(err);
    }
});

app.listen(8083, function () {
  console.log('Example app listening on port 8083!')
});