var express = require('express');
var Project = require('../model/Project');
var middleware = require('../../middleware');
var normalizePath = middleware.normalizePath;
var validateFile = middleware.validateFile;

var router = express.Router();

// Create project
router.post('/user/:username/projects/', function(req, res, next) {
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
router.get('/user/:username/projects/:project', function(req, res, next) {
    Project.findOne({ creator: req.params.username, project_name: req.params.project }, (err, project) => {
        if (err) return next({status: 500, message: err.message});
        if (!project) return next({status: 404, message: 'Project doesnt exist'});
        project.getFlattenedTree((err, tree) => {
            if (err) return next({status: 500, message: err.message });
            res.json(tree);
        });
    });
});

router.get('/user/:username/projects', function(req, res, next) {
    Project.getProjects(req.user.username, function(err, projects) {
        if (err) return next({status: 500, message: err.message});
        res.json(projects);
    });
});

// Create file for project
router.put('/user/:username/projects/:project/*', normalizePath, validateFile, function(req, res, next) {
    Project.findOne( { creator: req.params.username, project_name: req.params.project }, (err, project) => {
        if (err) return next({status: 500, message: err.message});
        if (!project) return next({status: 404, message: 'Project doesnt exist'});
        project.addFile(req.params.path, req.body.contents || "", req.body, function(err, newFile) {
            if (err) return next({status: 500, message: err.message });
            res.json(newFile);
        });
    });
});

// update file for project
router.patch('/user/:username/projects/:project/*', normalizePath, function(req, res, next) {
    var fileType = req.params.path.split('.').slice(-1)[0];
    if (!['html', 'js', 'css'].includes(fileType)) {
        return next({status: 400, message: 'Cannot update a directory'});
    }
    Project.findOne( { creator: req.params.username, project_name: req.params.project }, (err, project) => {
        if (err) return next({status: 500, message: err.message});
        if (!project) return next({status: 404, message: 'Project doesnt exist'});
        project.updateFile(req.params.path, req.body.contents, function(err, updatedFile) {
            if (err) return next({ status: 500, message: err.message });
            res.json(updatedFile);
        });
    });
});

// Read file for project
router.get('/user/:username/projects/:project/*', normalizePath, function(req, res, next) {
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
router.delete('/user/:username/projects/:project/*', normalizePath, function(req, res, next) {
    Project.findOne( { creator: req.params.username, project_name: req.params.project }, (err, project) => {
        if (err) return next({status: 500, message: err.message});
        if (!project) return next({status: 404, message: 'Project doesnt exist'});
        project.deleteFile(req.params.path, function(err) {
            if (err) return next({ status: 500, message: err.message });
            res.end();
        });
    });
});

router.use(function (err, req, res, next) {
    if (err.code === 11000) {
        if (/webeditor.projects/.test(err.message)) {
            return next({ status: 400, type: 'json', message: { type: 'project_name', message: 'Project name already exists'}});
        } else if (/webeditor.file/.test(err.message)) {
            return next({ status: 400, type: 'json', message: { type: 'path', message: 'File/Directory already exists'}});
        }
    } else if (err.message && err.path) {
        return next({ status: 400, type: 'json', message: { type: err.path, message: err.message }});
    }
     next(err);
});

module.exports = router;