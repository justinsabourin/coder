var express = require('express');
var Project = require('../model/Project');
var middleware = require('../../middleware');
var normalizePath = middleware.normalizePath;
var validateFile = middleware.validateFile;
var validatePath = middleware.validatePath;
var validateCommit = middleware.validateCommit;

var router = express.Router();

// Create project
router.post('/users/:username/projects/', function(req, res, next) {
    var newProject = new Project({
        creator: req.params.username,
        project_name: req.body.project_name
    });
    newProject.save((err) => {
        if (err) return  next(err);
        return res.json(newProject.rest());
    });
});

// Get project
router.get('/users/:username/projects/:project', function(req, res, next) {
    var status = req.query.status === 'true';
    Project.findOne({ creator: req.params.username, project_name: req.params.project }, (err, project) => {
        if (err) return next({status: 500, message: err.message});
        if (!project) return next({status: 404, message: 'Project doesnt exist'});
        project.getFlattenedTree(status, (err, tree) => {
            if (err) return next(err);
            res.json(tree);
        });
    });
});

router.get('/users/:username/projects', function(req, res, next) {
    Project.getProjects(req.user.username, function(err, projects) {
        if (err) return next({status: 500, message: err.message});
        res.json(projects);
    });
});

router.get('/users/:username/projects/:project/status', function(req, res, next) {
    Project.findOne( { creator: req.params.username, project_name: req.params.project }, (err, project) => {
        if (err) return next({status: 500, message: err.message});
        if (!project) return next({status: 404, message: 'Project does not exist'});
        project.getStatus((err, status) => {
            if (err) return next(err);
            res.json(status);
        });
    });
});

router.post('/users/:username/projects/:project/commit', validateCommit, function(req, res, next) {
    var files = req.body.files; 
    var message = req.body.message;
    
    var status = req.query.status === 'true';
    Project.findOne( { creator: req.params.username, project_name: req.params.project }, (err, project) => {
        if (err) return next({status: 500, message: err.message});
        if (!project) return next({status: 404, message: 'Project does not exist'});
        project.commitFiles(files, message, status, (err, statuses) => {
            if (err) return next(err);
            res.json(statuses);
        });
    });
});

// Create file for project
router.put('/users/:username/projects/:project/path/*', normalizePath, validateFile, function(req, res, next) {
    var status = req.query.status === 'true';
    Project.findOne( { creator: req.params.username, project_name: req.params.project }, (err, project) => {
        if (err) return next({status: 500, message: err.message});
        if (!project) return next({status: 404, message: 'Project does not exist'});
        project.addFile(req.params.path, req.body.contents || "", req.body, status, function(err, newFile) {
            if (err) return next(err);
            res.json(newFile);
        });
    });
});

// update file for project
router.patch('/users/:username/projects/:project/path/*', normalizePath, validatePath, function(req, res, next) {
    var fileType = req.params.path.split('.').slice(-1)[0];
    if (!['html', 'js', 'css'].includes(fileType)) {
        return next({status: 400, message: 'Cannot update a directory'});
    }
    var status = req.query.status === 'true';
    Project.findOne( { creator: req.params.username, project_name: req.params.project }, (err, project) => {
        if (err) return next({status: 500, message: err.message});
        if (!project) return next({status: 404, message: 'Project does not exist'});
        project.updateFile(req.params.path, req.body.contents, status, function(err, updatedFile) {
            if (err) return next(err);
            res.json(updatedFile);
        });
    });
});

// Read file for project
router.get('/users/:username/projects/:project/path/*', normalizePath, validatePath, function(req, res, next) {
    Project.findOne( { creator: req.params.username, project_name: req.params.project }, (err, project) => {
        if (err) return next({status: 500, message: err.message});
        if (!project) return next({status: 404, message: 'Project doesnt exist'});
        project.getFile(req.params.path, function(err, file) {
            if (err) return next({ status: 500, message: err.message });
            if (!file) return next({ status: 404, message: "File doesnt exist" });
            res.json(file);
        });
    });
});

// Delete file for project
router.delete('/users/:username/projects/:project/path/*', normalizePath, validatePath, function(req, res, next) {
    var status = req.query.status === 'true';
    Project.findOne( { creator: req.params.username, project_name: req.params.project }, (err, project) => {
        if (err) return next({status: 500, message: err.message});
        if (!project) return next({status: 404, message: 'Project doesnt exist'});
        project.deleteFile(req.params.path, status, function(err,stats) {
            if (err) return next(err);
            if (status) return res.json(stats);
            res.end();
        });
    });
});

router.use(function (err, req, res, next) {
    if (err.code === 11000) {
        if (/webeditor.projects/.test(err.message)) {
            return next({ status: 400, type: 'json', message: { type: 'project_name', message: 'Project name already exists'}});
        }
    } else if (err.message && err.path) {
        return next({ status: 400, type: 'json', message: { type: err.path, message: err.message }});
    }
     next(err);
});

module.exports = router;