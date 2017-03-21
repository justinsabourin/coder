var router = require('express').Router();
var File = require('../../model/File');
var normalizePath = require('../../middleware').normalizePath;

const CONTENT_TYPE = {
    'html': 'text/html',
    'css': 'text/css',
    'javascript': 'application/javascript'
};


router.get('/user/:username/projects/:project/*', normalizePath, function(req, res, next) {
    var path = req.params.path === '/' ? '/index.html' : req.params.path;
    File.findOne({ project_name: req.params.project, creator: req.params.username, path, node_type: 'F'}, (err, file) => {
        if (err || !file) return next(err);
        var type = CONTENT_TYPE[file.file_type];
        if (!type) return next('Bad type');
        res.set('Content-Type', type);
        res.end(file.contents);
    });
});

router.use((err, req, res, next) => {
    res.json(err);
});

module.exports = router;