const mongoose = require("mongoose");
const Task = require("./Task");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  profilePic: {
    type: String,
    default: `https://api.dicebear.com/9.x/initials/svg/seed=${this.name}`,
  },
  Tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Task, // referencing Task collection via Task schema's _id field
    },
  ],
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
