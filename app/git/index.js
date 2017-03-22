const path = require('path');
const fsp = require('fs-promise');
const NodeGit = require('nodegit');

if (process.env.NODE_ENV !== 'production') {
    var config = require('../config.dev.js');
} else {
    var config = require('../config.js');
}

const securePath = function(filePath, username, project_name) {
    var absPath = path.resolve(path.join(config.repoPath, username, project_name, filePath));
    var reg = new RegExp('^' + path.join(config.repoPath, username, project_name) + '(/[a-zA-Z0-9]+)+(.(html|js|css))?$');
    if (!reg.test(absPath)) {
        return Promise.reject({status: 400, message: "Invalid file path"});
    } else {
        return Promise.resolve(absPath);
    }
};

const git = {};



git.initProject = function(username, project_name) {
      // have to break indentation, TODO: look for workaround
    const welcomeMessage = 
`<html>
    <head>
        <title>${username}</title>
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
                ${project_name}
            </span>
        </div>
    </body>
</html>`;
    
    var userPath = path.resolve(path.join(config.repoPath, username));
    var projectPath = path.join(userPath, project_name);

    var repo;
    var index;

    // Taken and modified from nodegit examples: https://github.com/nodegit/nodegit/blob/master/examples/add-and-commit.js
    return fsp.ensureDir(userPath)
        .then(() => fsp.mkdir(projectPath))
        .then(() => NodeGit.Repository.init(projectPath, 0))
        .then((repoResult) => {
            repo = repoResult;
            fsp.writeFile(path.join(projectPath, 'index.html'), welcomeMessage);
        })
        .then(() => repo.refreshIndex())
        .then((indexResult) => {index = indexResult;})
        .then(() => index.addByPath('index.html'))
        .then(() => index.write())
        .then(() => index.writeTree())
        .then((oid) => {
            var author = NodeGit.Signature.create(username,
                "schacon@gmail.com", 123456789, 60);
            var committer = NodeGit.Signature.create(username,
                "scott@github.com", 987654321, 90);
            repo.createCommit("HEAD", author, committer, "message", oid, []);
        });

};

git.getDirectoryTree = function(username, project) {
    var repoPath = path.join(config.repoPath, username, project);
    // Assumes caller is certain that project directory exists
    // maybe change in the future but poses no threat atm
    var tree = {};

    const treeCreate = (parentPath, fileName) => {
        if (fileName.startsWith('.')) return null;
        var realFilePath = path.join(repoPath, parentPath, fileName);
        var virtFilePath = path.join(parentPath, fileName);
        return fsp.stat(realFilePath)
            .then((stats) => {
                tree[virtFilePath] = {
                    name: fileName,
                    path: virtFilePath,
                };
                if (stats.isFile()) {
                    tree[virtFilePath].node_type = 'F';
                    var tmp = fileName.split('.').slice(-1)[0];
                    tree[virtFilePath].file_type = tmp === 'js' ? 'javascript' : tmp;
                    return Promise.resolve(tree);
                } else if (stats.isDirectory()) {
                    tree[virtFilePath].node_type = 'D';
                    return fsp.readdir(realFilePath)
                        .then((files) => { 
                            tree[virtFilePath].children = files.map(file => path.join(virtFilePath, file));
                            return Promise.all(files.map((file) => treeCreate(virtFilePath, file)));
                        })
                        .then(() => tree);
                } 
            });
    };

    return treeCreate('/', '')
        .then((tree) => {
            delete tree['/'];
            return tree;
        });
};

/**
 * Creates a file or updates a file that already exists,
 * Creates a directory or throws an error if directory already exists
 */
git.createFile = function(username, project, fileInfo) {
    var repoPath = path.join(config.repoPath, username, project);

    return fsp.exists(repoPath)
        .then(() => securePath(fileInfo.path, username, project))
        .then((realFilePath) => {
            if (fileInfo.type === 'F') {
                return fsp.writeFile(realFilePath, fileInfo.contents);
            } else if (fileInfo.type === 'D') {
                return fsp.mkdir(realFilePath);
            }
            
        });
};


git.deleteFile = function(username, project, filePath) {
    var repoPath = path.join(config.repoPath, username, project);

    return fsp.exists(repoPath)
        .then(() => securePath(filePath, username, project))
        .then((realFilePath) => fsp.remove(realFilePath));
};

git.commit = function(username, project, files, message) {
    var repoPath = path.join(config.repoPath, username, project);

    return fsp.exists(repoPath)
        .then(() => NodeGit.Repository.open(repoPath))
        .then((repo) => {
            var author = NodeGit.Signature.create(username,
                "schacon@gmail.com", 123456789, 60);
            var committer = NodeGit.Signature.create(username,
                "scott@github.com", 987654321, 90);
            repo.createCommitOnHead(files, author, committer, message);
        });
};

git.getFile = function(username, project, filePath) {
    var repoPath = path.join(config.repoPath, username, project);

    var file = {};
    var realPath;

    return fsp.exists(repoPath)
        .then(() => securePath(filePath, username, project))
        .then((realFilePath) => {
            realPath = realFilePath;
            return fsp.stat(realPath);
        })
        .then((stat) => {
            if (stat.isDirectory()) file.type = 'D';
            if (stat.isFile()) file.type = 'F';
        })
        .then(() => { 
            if (file.type === 'F') return fsp.readFile(realPath, { encoding: 'utf-8' });
            if (file.type === 'D') return fsp.readdir(realPath);
        })
        .then((contents) => {
            file.contents = contents;
            return file;
        });
};

git.pushToRepo = function(project, username) {

};






module.exports = git;