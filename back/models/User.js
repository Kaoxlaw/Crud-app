import mongoose from "mongoose";
import bcrypt from "bcrypt";

let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  hash_password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.hash_password);
};

export default mongoose.model("User", UserSchema);
