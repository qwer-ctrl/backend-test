import { Schema, model } from 'mongoose'

const ExerciseSchema = new Schema({
  exercise: {
    type: String, 
    required: true,
  },
   metrics: {
     type: String,
     enum: ['set', 'reps', 'weights', 'minutes', 'seconds', 'length', 'duration', 'link'],
     required: true,
   }
})

export default model('Exercise', ExerciseSchema)