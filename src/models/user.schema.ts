import mongoose, { Schema } from "mongoose";
import pkgBcrypt from "bcryptjs";
const { hash, compare, genSalt } = pkgBcrypt;
import pkg from "validator";
const { isEmail } = pkg;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "username field is required."],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "passowrd field is required."],
    select: false,
  },
  email: {
    type: String,
    required: [true, "email field is required"],
    unique: true,
    validate: [isEmail, "invalid email."],
    trim: true,
  },
  followers: {
    type: Map,
    of: String,
  },
  following: {
    type: Map,
    of: String,
  },
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const salt = await genSalt(12);
    this.password = await hash(this.password, salt);
  }
});

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

userSchema.methods.comparePassword = async function (
  loginPassword: string
): Promise<true | false> {
  return await compare(loginPassword, this.password);
};

export default userSchema;
