const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name.'],
  },
  email: {
    type: String,
    required: [true, 'User must have a email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Type correct email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'User must have a password.'],
    minLength: 8,
    selected: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      //THIS only works on CREATE and SAVE!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (candidatePass, userPass) {
  return await bcrypt.compare(candidatePass, userPass);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
