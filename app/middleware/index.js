module.exports.authorizedRoute = function(req, res, next) {
    if (!req.user) {
        return next({status: 401, message: "Unauthenticated"});
    }
    next();
};

module.exports.privateRoute = function(req, res, next) {
    if (req.params.username && req.user.username !== req.params.username)
        return next({status: 401, message: "Unauthorized"});
    next();
};

module.exports.normalizePath = function(req, res, next) {
    req.params.path = req.params['0'];
    if (req.params.path.includes('//') || req.params.path === '/') {
        // malformed
        return next({status: 400, message: 'Malformed file path'});
    }
    req.params.path = req.params.path.endsWith('/') ? req.params.path.slice(0,-1) : req.params.path;
    req.params.path = req.params.path.startsWith('/') ? req.params.path.slice(1) : req.params.path;
    req.params.path = '/'.concat(req.params.path);
    next();
};

module.exports.validateFile = function(req, res, next) {
    var fileName = req.params.path.slice(req.params.path.lastIndexOf('/') + 1);
    if (req.body.type === 'F') {
        match = /^[a-zA-Z0-9]+.(html|js|css)$/g.exec(fileName);
        if (!match || !match[1]) {
            return next({status: 400, message: "You can only create html, css or javascript files"});
        } 
        req.body.file_type = match[1] === 'js' ? 'javascript' : match[1];
    } else if (req.body.type === 'D') {
        match = fileName.match(/^[a-zA-Z0-9]+$/g);
        if (!match) {
            return next({status: 400, message: "Directory names must be alphanumeric"});
        }
    } else {
        return next({status: 400, message: "Unrecognized type"});
    }
    next();
};

module.exports.validatePath = function(req, res, next) {
    if (/^(\/[a-zA-Z0-9]+)+(\.(html|js|css))?$/.test(req.params.path)) {
        return next();
    }
    return next({status: 400, message: 'Invalid path. Directories must be alphanumberic and files must be alphanumeric and end in .html, .css or .js'});
};

module.exports.validateCommit = function(req, res, next) {
    if (!req.body.files || req.body.files.constructor !== Array || req.body.files.length == 0) {
        return next({status: 400, message: 'Files must be a non empty array'});
    } else if (!req.body.message || typeof req.body.message !== 'string' || req.body.message.length === 0) {
        return next({status: 400, message: 'Commit message must be a non empty string'});
    } else {
        var error = req.body.files.find(file => !file.path || !file.type);
        if (error){
            return next({status: 400, message: 'Files are malformed. Must contain a path and type'});
        }
        next();
    }
};