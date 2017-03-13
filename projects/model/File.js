var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fileSchema = new Schema({
    project_name: { type: String, required: true},
    creator: { type: String, required: true },
    name: { type: String, required: true },
    path: { type: String, required: true },
    node_type: { type: String, required: true, enum: ['D', 'F'] },
    contents: String,

    created_at: Date,
    updated_at: Date 
});

fileSchema.pre('save', function(next) {
    var now = new Date();
    this.updated_at = now;
    this.created_at = this.created_at || now;

    if (this.node_type === 'D' && this.content) {
        next(Error("A directory cannot have content"));
    }
    next();

});

fileSchema.methods.rest = function() {
    return {
        project_name: this.project_name,
        creator: this.creator,
        name: this.name,
        path: this.path,
        node_type: this.node_type,
        contents: this.node_type === 'F' ? this.contents : undefined,
        created_at: this.created_at,
        updated_at: this.updated_at
    };
}





var File = mongoose.model('File', fileSchema);


module.exports = File;