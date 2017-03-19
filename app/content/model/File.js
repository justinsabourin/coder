var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fileSchema = new Schema({
    project_name: { type: String, required: true},
    creator: { type: String, required: true },
    name: { type: String, required: true },
    path: { type: String, required: true },
    node_type: { type: String, required: true, enum: ['D', 'F'] },
    contents: String,
    file_type: {type: String, enum: ['html', 'css', 'javascript']},
    created_at: Date,
    updated_at: Date 
});


var File = mongoose.model('File', fileSchema);


module.exports = File;