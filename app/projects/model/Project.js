var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var File = require('../../model/File');



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
    // have to break indentation, TODO: look for workaround
    const welcomeMessage = 
`<html>
    <head>
        <title>${this.creator}</title>
        <style>
            body {
                background-color: #efffff;
            }
            
            .container {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100vw;
                height: 90vh;
            }
            
            .text {
                font-size: 5em;
                color: black;
                font-family: serif;
            }
            
        </style>
    </head>
    <body>
        <div class="container">
            <span class="text">
                ${this.project_name}
            </span>
        </div>
    </body>
</html>`;

    var newFile = new File({
        project_name: this.project_name,
        creator: this.creator,
        name: 'index.html',
        path: '/index.html',
        node_type: 'F',
        file_type: 'html',
        contents: welcomeMessage,
    });

    newFile.save(next);
});

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

projectSchema.methods.getFlattenedTree = function(cb) {
    File.find({ project_name: this.project_name, creator: this.creator}, 'name path node_type file_type created_at updated_at')
    .sort({'path.length' : 1})
    .exec((err, nodes) => {
        if (err) return cb(err);
        
        var tree = {};
        tree.files = {};
        nodes.forEach((node) => {
            tree.files[node.path] = node.rest();
            tree.files[node.path].children = [];
            var parentPath = node.path.slice(0, node.path.lastIndexOf('/'));
            if (parentPath === "") return;
            tree.files[parentPath].children.push(node.path);
        });


        tree.project_name = this.project_name;
        tree.creator = this.creator;
        return cb(null, tree);

    });
}

projectSchema.methods.addFile = function(filePath, fileContents, file, cb) {
    var splitter = filePath.lastIndexOf('/');
    var fileName = filePath.slice(splitter + 1);

    const saveFile = () => {
        var newFile = new File({
                project_name: this.project_name,
                creator: this.creator,
                name: fileName,
                path: filePath,
                node_type: file.type,
                file_type: file.file_type,
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

projectSchema.statics.deleteFile = function(projectName, creator, filePath, cb) {
    File.remove({ project_name: projectName, creator: creator, path: new RegExp('^' + filePath +'(/[a-zA-Z0-9.]*)*$', 'g')}, cb); 
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