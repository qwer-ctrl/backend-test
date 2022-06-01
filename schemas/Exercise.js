import { Schema, model } from 'mongoose'

const ExerciseSchema = new Schema({
  exercise: {
    type: String, 
    required: true,
  },
   metrics: {
     type: String,
     enum: ['set', 'reps', 'weights'],
     required: true,
   }
})

export default model('Exercise', ExerciseSchema)