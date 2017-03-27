var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var File = require('../../model/File');
var git = require('../../git');



var projectSchema = new Schema({
    project_name: { 
        type: String, 
        required: true, 
        minlength: [2, 'Username must be between 2 and 15 characters'], 
        maxlength: [15, 'Username must be between 2 and 15 characters'],
        match: [/^[0-9a-zA-Z]+$/, "Username must be alphanumeric"]
    },
    creator: { type: String, required: true },
    // more project specific settings we can add
});

projectSchema.index({creator: 1, project_name: -1}, {unique: true});


projectSchema.pre('save', function(next) {

    if (this.isNew) {
        git.initProject(this.creator, this.project_name)
            .then(() => next())
            .catch((err) => next(err));
    } else {
        next();
    }
    
    
});

projectSchema.methods.rest = function(){
    return {
        project_name: this.project_name,
        creator: this.creator
    };
};


projectSchema.methods.getFlattenedTree = function(status, cb) {
     var project = {
                creator: this.creator,
                project_name: this.project_name,
            };
    git.getDirectoryTree(this.creator, this.project_name)
        .then((tree) => {
            project.files = tree;
            
            return !status ? cb(null, project) :
                git.status(this.creator, this.project_name)
                    .then(statuses => {
                        project.status = statuses;
                        return cb(null, project);
                    });

        })
        .catch(cb);
};

projectSchema.methods.addFile = function(filePath, fileContents, file, status, cb) {
    var result = {
        project_name: this.project_name,
        creator: this.creator,
        name: filePath.split('/').slice(-1)[0],
        path: filePath,
        node_type: file.type,
        file_type: file.file_type,
        contents: file.file_type === 'F' ? fileContents : undefined,
    };
    git.createFile(this.creator, this.project_name, {
        path: filePath,
        type: file.type,
        contents: fileContents
    })
    .then(() => {
        return !status ? cb(null, result) :
            git.status(this.creator, this.project_name)
                .then(statuses => {
                    result.status = statuses;
                    return cb(null, result);
                });   
    })
    .catch(cb);
};

projectSchema.methods.updateFile = function(filePath, fileContents, status, cb) {
    var fileType = filePath.split('.').slice(-1)[0];
    var result = {
        project_name: this.project_name,
        creator: this.creator,
        name: filePath.split('/').slice(-1)[0],
        path: filePath,
        node_type: 'f',
        file_type: fileType === 'js' ? 'javascript' : fileType,
        contents: fileContents,
    };
    
    git.createFile(this.creator, this.project_name, {
        path: filePath,
        type: 'F',
        contents: fileContents
    })
    .then(() => {
        return !status ? cb(null, result) :
            git.status(this.creator, this.project_name)
                .then(statuses => {
                    result.status = statuses;
                    return cb(null, result);
                });   
    })
    .catch(cb);
};

projectSchema.methods.getFile = function(filePath, cb) {
    git.getFile(this.creator, this.project_name, filePath)
        .then((data) => {
            var fileType = data.type === 'F' ? filePath.split('.').slice(-1)[0]:  undefined;
            fileType = fileType && (fileType === 'js' ? 'javascript' : fileType);
            cb(null, {
                project_name: this.project_name,
                creator: this.creator,
                name: filePath.split('/').slice(-1)[0],
                path: filePath,
                node_type: data.type,
                file_type: fileType,
                contents: data.contents
            });
        })
        .catch(cb); 
};

projectSchema.methods.deleteFile = function(filePath, status, cb) {
    git.deleteFile(this.creator, this.project_name, filePath)
        .then(() => 
            !status ? cb(null) : 
                git.status(this.creator, this.project_name)
                    .then(statuses => cb(null, {status: statuses}))
        )
        .catch(cb);
};

projectSchema.methods.getStatus = function(cb) {
    git.status(this.creator, this.project_name)
        .then(statuses => {
            cb(null, statuses);
        })
        .catch(cb);
};

projectSchema.methods.commitFiles = function(files, message, status, cb) {
    var filesToUpdate = files.reduce((accum, file) => {
        if (file.type === 'DELETED') accum.toDelete.push(file.path);
        else accum.toCommit.push(file.path);
        return accum;
    }, {toDelete: [], toCommit: []});
    git.commit(this.creator, this.project_name, filesToUpdate.toDelete, filesToUpdate.toCommit, message)
        .then(() =>  
        !status ? cb(null, {commit: 'success'}) : 
                git.status(this.creator, this.project_name)
                    .then(statuses => cb(null, {commit: 'success', status: statuses})))
        .catch(cb);
};

projectSchema.statics.getProjects = function(username, cb) {
    this.find({ creator: username }, (err, projects) => {
        if(err) cb(err);
        cb(null, {
            list: projects.map((project) => project.rest()),
        });
    });
};

var Project = mongoose.model('Project', projectSchema);


module.exports = Project;