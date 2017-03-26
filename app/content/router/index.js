var router = require('express').Router();
var File = require('../../model/File');
var normalizePath = require('../../middleware').normalizePath;
var git = require('../../git');

const CONTENT_TYPE = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript'
};


router.get('/users/:username/projects/:project/*', normalizePath, function(req, res, next) {
    var path = req.params.path === '/' ? '/index.html' : req.params.path;
    var fileType = path.split('.').slice(-1)[0];
    if (!['html', 'js', 'css'].includes(fileType)) {
        return next('Can not retrieve directories');
    }
    git.getFile(req.params.username, req.params.project, path)
        .then((file) => {
            var type = CONTENT_TYPE[fileType];
            res.set('Content-Type', type);
            res.end(file.contents);
        })
        .catch(next);
});

router.use((err, req, res, next) => {
    res.json(err);
});

module.exports = router;