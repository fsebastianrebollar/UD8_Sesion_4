const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username:  {type: String, required: true, maxlength: 20, unique:true},
  password:  {type: String, required: true, maxlength: 20},
});

module.exports = mongoose.model("User", UserSchema);