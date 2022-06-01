import Exercise from "../schemas/Exercise"
import express from "express"

const router = express.Router()

router.post("/exercises", async (req, res) => {
  const {exercise} = req.body
  try {
    const newExercise = await new Exercise.find({exercise}).save();
    res.status(200).json({
      response: newExercise,
      success: true
    })
  } catch(error) {
    res.status(400).json({
      response: error, 
      success: false
    })
  }
})

router.get("/exercises", async (req, res) => {
  try {
    const exercises = await Exercise.find({})
    res.status(200).json({
      response: exercises,
      success: true 
    }) 
  } catch(error) {
    res.status(400).json({
      response: 'Could not get exercise',
      success: false
    })
  }
})

export default router
