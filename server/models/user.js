const mongoose = require('mongoose');

// Define the User model schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    index: { unique: true }
  },
  password: {
      type: String
  }
});

module.exports = mongoose.model('users2', UserSchema);
