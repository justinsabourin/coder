var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: String,
  github: {
      token: String,
      username: String
  },
  created_at: Date,
  updated_at: Date
});

userSchema.pre('save', function(next) {
    var now = new Date();
    this.updated_at = now;
    this.created_at = this.created_at || now;

    if (!this.password && (!this.github || this.github === {})) {
        throw new Error('User must have a password or third party login credentials');
    }

    if (this.password) {
        this.password = bcrypt.hashSync(this.password, null);
    }
    
    next();

});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.rest = function() {
    return {
      username: this.username,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
};

userSchema.statics.findByUsername = function(username, cb) {
    return this.findOne({ username: username }, cb);
};




var User = mongoose.model('User', userSchema);


module.exports = User;