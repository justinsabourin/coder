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
  creator: {
    type: String,
    required: true
  },
  // more project specific settings we can add
});

projectSchema.index({
  creator: 1,
  project_name: -1
}, {
  unique: true
});


projectSchema.pre('save', function (next) {

  if (this.isNew) {
    git.initProject(this.creator, this.project_name)
      .then(() => next())
      .catch((err) => next(err));
  } else {
    next();
  }


});

projectSchema.methods.rest = function () {
  return {
    project_name: this.project_name,
    creator: this.creator
  };
};


projectSchema.methods.getFlattenedTree = async function (status, cb) {
  let project = {
    creator: this.creator,
    project_name: this.project_name,
  };

  try {
    const tree = await git.getDirectoryTree(this.creator, this.project_name)
    project.files = tree;

    if (status) {
      project.status = await git.status(this.creator, this.project_name);
    }
    cb(null, project);
  } catch (err) {
    cb(err);
  }

};

projectSchema.methods.addFile = async function (filePath, fileContents, file, status, cb) {
  let result = {
    project_name: this.project_name,
    creator: this.creator,
    name: filePath.split('/').slice(-1)[0],
    path: filePath,
    node_type: file.type,
    file_type: file.file_type,
    contents: file.file_type === 'F' ? fileContents : undefined,
  };
  try {
    await git.createFile(this.creator, this.project_name, {
      path: filePath,
      type: file.type,
      contents: fileContents
    })
    if (status) {
      result.status = await git.status(this.creator, this.project_name);
    }
    cb(null, result);
  } catch (err) {
    cb(err)
  }

};

projectSchema.methods.updateFile = async function (filePath, fileContents, status, cb) {
  let fileType = filePath.split('.').slice(-1)[0];
  let result = {
    project_name: this.project_name,
    creator: this.creator,
    name: filePath.split('/').slice(-1)[0],
    path: filePath,
    node_type: 'f',
    file_type: fileType === 'js' ? 'javascript' : fileType,
    contents: fileContents,
  };
  try {
    await git.createFile(this.creator, this.project_name, {
      path: filePath,
      type: 'F',
      contents: fileContents
    })
    if (status) {
      result.status = await git.status(this.creator, this.project_name);
    }
    cb(null, result);
  } catch (err) {
    cb(err)
  }
};

projectSchema.methods.getFile = async function (filePath, cb) {
  try {
    let data = await git.getFile(this.creator, this.project_name, filePath);

    let fileType = data.type === 'F' ? filePath.split('.').slice(-1)[0] : undefined;
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
  } catch (err) {
    cb(err)
  }

};

projectSchema.methods.deleteFile = async function (filePath, status, cb) {
  try {
    await git.deleteFile(this.creator, this.project_name, filePath)

    if (status) {
      cb(null, {
        status: await git.status(this.creator, this.project_name)
      });
    }
  } catch (err) {
    cb(err)
  }
};

projectSchema.methods.getStatus = async function (cb) {
  try {
    cb(null, await git.status(this.creator, this.project_name));
  } catch (err) {
    cb(err)
  }
};

projectSchema.methods.commitFiles = async function (message, status, cb) {
  try {
    await git.commit(this.creator, this.project_name, message)

    if (!status) {
      cb(null, {
        commit: 'success'
      })
    } else {
      cb(null, {
        commit: 'success',
        status: await git.status(this.creator, this.project_name)
      })
    }
  } catch (err) {
    cb(err);
  }
};

projectSchema.methods.stageFiles = async function (files, status, cb) {
  let filesToUpdate = files.reduce((accum, file) => {
    if (file.type === 'DELETED') accum.toDelete.push(file.path);
    else accum.toCommit.push(file.path);
    return accum;
  }, {
    toDelete: [],
    toCommit: []
  });
  try {
    await git.add(this.creator, this.project_name, filesToUpdate.toDelete, filesToUpdate.toCommit)

    if (!status) {
      cb(null, {
        stage: 'success'
      })
    } else {
      cb(null, {
        stage: 'success',
        status: await git.status(this.creator, this.project_name)
      })
    }
  } catch (err) {
    cb(err);
  }
};

projectSchema.statics.getProjects = function (username, cb) {
  this.find({
    creator: username
  }, (err, projects) => {
    if (err) cb(err);
    cb(null, {
      list: projects.map((project) => project.rest()),
    });
  });
};

var Project = mongoose.model('Project', projectSchema);


module.exports = Project;