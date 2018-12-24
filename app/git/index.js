const path = require('path');
const fsp = require('fs-promise');
const NodeGit = require('nodegit');

if (process.env.NODE_ENV !== 'production') {
  var config = require('../config.dev.js');
} else {
  var config = require('../config.js');
}

const securePath = function (filePath, username, project_name) {
  var absPath = path.resolve(path.join(config.repoPath, username, project_name, filePath));
  var reg = new RegExp('^' + path.join(config.repoPath, username, project_name) + '(/[a-zA-Z0-9]+)+(.(html|js|css))?$');
  if (!reg.test(absPath)) {
    return Promise.reject({
      status: 400,
      message: "Invalid file path"
    });
  } else {
    return Promise.resolve(absPath);
  }
};

const sanitizePath = async (fpath, username, project, repoPath) => (await securePath(fpath, username, project)).match(new RegExp('^' + path.join(repoPath, '/') + '(.*)$'))[1];

const git = {};



git.initProject = async function (username, project_name) {
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

  const userPath = path.resolve(path.join(config.repoPath, username));
  const projectPath = path.join(userPath, project_name);


  // Taken and modified from nodegit examples: https://github.com/nodegit/nodegit/blob/master/examples/add-and-commit.js
  try {
    await fsp.ensureDir(userPath)
    await fsp.mkdir(projectPath)
  } catch (err) {
    throw {
      status: 400,
      type: 'json',
      message: {
        type: 'project_name',
        message: 'Project name already exists'
      }
    }
  }

  try {
    let repo = await NodeGit.Repository.init(projectPath, 0);
    await fsp.writeFile(path.join(projectPath, 'index.html'), welcomeMessage);
    let index = await repo.refreshIndex();
    await index.addByPath('index.html');
    await index.write();
    let oid = await index.writeTree();
    await repo.createCommit("HEAD", NodeGit.Signature.create(username,
      "schacon@gmail.com", 123456789, 60), NodeGit.Signature.create(username,
      "scott@github.com", 987654321, 90), "message", oid, []);
  } catch (err) {
    throw err.status ? err : {
      status: 500,
      message: 'Unable to create project at this time. Try again later.'
    }
  }

};

git.getDirectoryTree = async function (username, project) {
  let repoPath = path.join(config.repoPath, username, project);

  const treeCreate = async (parentPath, fileName, tree = {}) => {
    if (fileName.startsWith('.')) return null;
    let realFilePath = path.join(repoPath, parentPath, fileName);
    let virtFilePath = path.join(parentPath, fileName);
    let stats = await fsp.stat(realFilePath)
    tree[virtFilePath] = {
      name: fileName,
      path: virtFilePath,
    };
    if (stats.isFile()) {
      tree[virtFilePath].node_type = 'F';
      let tmp = fileName.split('.').slice(-1)[0];
      tree[virtFilePath].file_type = tmp === 'js' ? 'javascript' : tmp;
      return tree;
    } else if (stats.isDirectory()) {
      tree[virtFilePath].node_type = 'D';
      let files = await fsp.readdir(realFilePath);
      tree[virtFilePath].children = files.map(file => path.join(virtFilePath, file));
      files.forEach(async file => await treeCreate(virtFilePath, file, tree));
      return tree;
    }
  };
  try {
    let tree = await treeCreate('/', '');
    delete tree['/'];
    return tree;
  } catch (err) {
    throw {
      status: 500,
      message: 'Unable to get directory tree for project at this time. Please try again later'
    };
  }
};

/**
 * Creates a file or updates a file that already exists,
 * Creates a directory or throws an error if directory already exists
 */
git.createFile = async function (username, project, fileInfo) {
  let repoPath = path.join(config.repoPath, username, project);
  try {
    await fsp.exists(repoPath);
    let realFilePath = await securePath(fileInfo.path, username, project);
    if (fileInfo.type === 'F') {
      return fsp.writeFile(realFilePath, fileInfo.contents);
    } else if (fileInfo.type === 'D') {
      return fsp.mkdir(realFilePath);
    }

  } catch (err) {
    if (err.status) throw err;
    if (err.code === 'EEXIST') throw {
      status: 400,
      message: `Directory ${fileInfo.path} already exists`
    };
    throw {
      status: 500,
      message: 'Unable to create file at this time. Please try again later.'
    };
  }
};


git.deleteFile = async function (username, project, filePath) {
  let repoPath = path.join(config.repoPath, username, project);
  try {
    await fsp.exists(repoPath)
    let realFilePath = await securePath(filePath, username, project);
    await fsp.remove(realFilePath);
  } catch (err) {
    throw {
      status: 500,
      message: 'Unable to delete file.'
    };
  }
};

git.add = async function (username, project, deletedFiles, changedFiles) {
  let repoPath = path.join(config.repoPath, username, project);

  try {
    await fsp.exists(repoPath);
    let repo = await NodeGit.Repository.open(repoPath);
    let index = await repo.refreshIndex();

    if (changedFiles.length !== 0) {
      await Promise.all(changedFiles.map(async file => await index.addByPath(await sanitizePath(file, username, project, repoPath))));
    }
    if (deletedFiles.length !== 0) {
      await Promise.all(deletedFiles.map(async file => await index.removeByPath(await sanitizePath(file, username, project, repoPath))));
    }


    await index.write();
  } catch (err) {
    console.log("Err: ", err);
    throw {
      status: 500,
      message: 'Unable to add files.'
    };
  }
}

git.commit = async function (username, project, message) {
  let repoPath = path.join(config.repoPath, username, project);

  try {
    await fsp.exists(repoPath);
    let repo = await NodeGit.Repository.open(repoPath);
    let index = await repo.refreshIndex();
    let oid = await index.writeTree()
    let head = await NodeGit.Reference.nameToId(repo, 'HEAD');
    let parent = await repo.getCommit(head);
    let author = committer = NodeGit.Signature.now(username, "text@example.com");
    await repo.createCommit('HEAD', author, committer, message, oid, [parent]);
  } catch (err) {
    console.log(err);
    throw err.status ? err : {
      status: 500,
      message: 'Unable to commit files at this time'
    }
  }
};


git.getFile = async function (username, project, filePath) {
  let repoPath = path.join(config.repoPath, username, project);

  let file = {};

  try {
    await fsp.exists(repoPath)
    let realPath = await securePath(filePath, username, project);
    let stat = await fsp.stat(realPath);

    if (stat.isDirectory()) file.type = 'D';
    else if (stat.isFile()) file.type = 'F';

    if (file.type === 'F')
      file.contents = await fsp.readFile(realPath, {
        encoding: 'utf-8'
      });
    if (file.type === 'D')
      file.contents = await fsp.readdir(realPath);

    return file;
  } catch (err) {
    console.log(err);
    throw err.status ? err : {
      status: 500,
      message: 'Unable to read file at this time.'
    }
  }
};

git.pushToRepo = function (project, username) {

};

git.status = async function (username, project) {
  let repoPath = path.join(config.repoPath, username, project);
  try {
    await fsp.exists(repoPath)
  } catch (err) {
    throw {
      status: 404,
      message: 'Project does not exist'
    }
  }

  try {
    let repo = await NodeGit.Repository.open(repoPath);
    let statuses = await repo.getStatus();
    return statuses.reduce(function (accum, file) {
      let status = {};
      status.path = '/' + file.path();
      console.log(file)
      console.log(file.inIndex())
      console.log(file.inWorkingTree());
      console.log(file.headToIndex());
      console.log(file.indexToWorkdir());
      if (file.isNew()) status.type = 'NEW';
      if (file.isDeleted()) status.type = 'DELETED';
      if (file.isModified()) status.type = 'MODIFIED';
      if (file.isRenamed()) status.type = 'RENAMED';
      if (file.isConflicted()) status.type = 'CONFLICTED';
      if (file.inIndex()) accum.staged[status.path] = status;
      if (file.inWorkingTree()) accum.unstaged[status.path] = status;
      return accum;
    }, {
      staged: {},
      unstaged: {}
    });
  } catch (err) {
    console.log(err)
    throw err.status ? err : {
      status: 500,
      message: 'Unable to get project status at this time'
    };
  }
};





module.exports = git;