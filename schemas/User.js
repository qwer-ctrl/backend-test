import { Schema, model } from 'mongoose'
import ProgramSchema from './Program'
//const mongoose = require("mongoose")

const UserSchema = new Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      default: () => crypto.randomBytes(128).toString("hex")
    },
    //program: [ProgramSchema]
  })

export default model('User', UserSchema)
//module.exports = mongoose.model('User', UserSchema)