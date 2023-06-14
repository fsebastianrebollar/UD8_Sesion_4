const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user_email:  {type: String, required: true, maxlength: 40},
  comment:  {type: String, required: true, maxlength: 240},
  dt: {type: String, required: true, default: Date.now},
});

module.exports = mongoose.model("Comment", CommentSchema);