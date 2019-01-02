const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

let UserSchema = new Schema({
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
  },
  rentalPrefs: {
    country: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    price: {
      min: {
        type: Number
      },
      max: {
        type: Number
      }
    },
    bedrooms: {
      min: {
        type: Number
      },
      max: {
        type: Number
      }
    },
    bathrooms: {
      min: {
        type: Number
      },
      max: {
        type: Number
      }
    }
  },
  listings: [{ type: Schema.Types.ObjectId, ref: 'Listing' }]
});

/*
MAKE INTO ASYNC

schema.pre('save', async function() {
  await doStuff();
  await doMoreStuff();
});
*/
UserSchema.pre('save', async function() {
  let user = this;

  // TODO: extract into helper function
  const hashedPass = await new Promise((resolve, reject) => {
    bcrypt.hash(user.password, saltRounds, function (err, hash) {
      if(err) reject(err);
      resolve(hash);
    });
  });

  // set user password to hash
  user.password = hashedPass;
  return user;
});

// should not make methods on UserSchema. MAKE HELPER
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Export the model
module.exports = mongoose.model('User', UserSchema);