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
  firstname: {
    type: String, 
  },
  lastname: {
    type: String, 
  },
  adress: {
    type: String, 
  },
  age: {
    type: Number, 
  },
  job: {
    type: String, 
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
