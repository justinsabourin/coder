var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var File = require('./File');

var projectSchema = new Schema({
    project_name: { type: String, required: true},
    creator: { type: String, required: true },
    // more project specific settings we can add
});

projectSchema.index({creator: 1, project_name: -1}, {unique: true});

projectSchema.methods.rest = function(){
    return {
        project_name: this.project_name,
        creator: this.creator
    };
};

projectSchema.methods.getTreeStructure = function(cb) {
    File.find({ project_name: this.project_name, creator: this.creator}, 'name path node_type created_at updated_at', (err, nodes) => {
        if (err) return cb(err);
        var tree = nodes.reduce((accum, node) => {
            
            var path = node.path.split('/').slice(1);
            var root = accum;
            path.forEach((name) => {
                if (!root.files)
                    root.files = {};
                if(!root.files[name])
					root.files[name] = {name};
				root = root.files[name];
            });
            root.name = node.name;
            root.path = node.path;
            root.node_type = node.node_type;
            root.created_at = node.created_at;
            root.updated_at = node.updated_at;
            return accum;
        }, {});
        tree.project_name = this.project_name;
        tree.creator = this.creator;
        return cb(null, tree);

    });
};

projectSchema.methods.addFile = function(filePath, fileContents, fileType, cb) {
    var splitter = filePath.lastIndexOf('/');
    var fileName = filePath.slice(splitter + 1);

    const saveFile = () => {
        var newFile = new File({
                project_name: this.project_name,
                creator: this.creator,
                name: fileName,
                path: filePath,
                node_type: fileType,
                contents: fileContents,
        });

        newFile.save((err) => {
            if (err) return cb(err);
            cb(null, newFile);
        });
    };

    if (splitter === 0) {
        saveFile();
    } else {
        var path = filePath.slice(0, splitter);
        File.findOne({ project_name: this.project_name, creator: this.creator, path: path }, "node_type", (err, file) => {
            if (err) return cb(err);
            console.log(file);
            if (!file) return cb({message: "Top-level directory does not exist"});
            if (file.node_type !== 'D') return cb({message: "Can't create file inside another file"});
            saveFile();
        });
    }
};

projectSchema.statics.updateFile = function(projectName, creator, filePath, fileContents, cb) {
    File.findOneAndUpdate({ project_name: projectName, creator: creator, path: filePath, node_type: 'F'}, 
                          { $set: { contents: fileContents } },
                          { new: true }, 
                          cb);
};

projectSchema.statics.getFile = function(projectName, creator, filePath, cb) {
    File.findOne({ project_name: projectName, creator: creator, path: filePath}, cb); 
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