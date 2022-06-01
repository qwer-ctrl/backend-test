import Program from "../schemas/Program"
import UserSchema from "../schemas/User"
import express from "express"
import crypto from "crypto"


const router = express.Router()

router.post("/programs", async (req, res) => {
    const {programType} = req.body
    try {
      const newProgram = await new Program({programType}).save();
      res.status(201).json({
        response: newProgram,
        success: true
      })
    } catch(error) {
      res.status(400).json({
        response: error, 
        success: false
      })
    }
  })
  
  router.get("/programs", authenticateUser)
  router.get("/programs", async (req, res) => {
    try {
      const programs = await Program.find({})
      res.status(200).json({
        response: programs,
        success: true 
      }) 
    } catch(error) {
      res.status(400).json({
        response: 'Could not get programs',
        success: false
      })
    }
  })

  
  const authenticateUser = async (req, res, next) => {
    const accessToken = req.header("Authorization")
  
    try {
      const user = await findOne({ accessToken: accessToken })
      if (user) {
        next()
      } else {
        res.status(401).json({
          response: "Please log in",
          success: false
        })
      }
    } catch (error) {
      res.status(400).json({
        response: error,
        success: false
      })
    }
  }
  
  router.get("/mypage", authenticateUser)
  router.get("/mypage", async (req, res) => {
    const {program} = req.body
    try {
      const mypage = await User.find({})
      res.status(200).json({
        response: program,
        success: true 
      }) 
    } catch(error) {
      res.status(400).json({
        response: 'Could not get programs',
        success: false
      })
    }
  })

  export default router
