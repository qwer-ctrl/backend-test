import { Schema, model } from 'mongoose'
import ExerciseSchema from './Exercise'
//const mongoose = require("mongoose")

const ProgramSchema = new Schema({
    programType: {
      type: String,
      enum: ['Weights', 'Cardio'],
      required: true,
    },
    // exercise: ExerciseSchema,
    createdAt: {
      type: Date,
      default: () => new Date()
    },
    programName: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 50
    }
  })

export default model('Program', ProgramSchema)
//module.exports = mongoose.model('Program', ProgramSchema)