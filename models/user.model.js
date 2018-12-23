const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

let userSchema = new Schema({
  username: {
    type: String, 
    required: true,
    trim: true,
    index: { 
      unique: true 
    }
  },
  password: {
    type: String, 
    required: true,
    trim: true
  }
});

/*
MAKE INTO ASYNC

schema.pre('save', async function() {
  await doStuff();
  await doMoreStuff();
});
*/
userSchema.pre('save', function(next) {
  // this.password = await method();
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

// should not make methods on userSchema. MAKE HELPER
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Export the model
module.exports = mongoose.model('User', userSchema);