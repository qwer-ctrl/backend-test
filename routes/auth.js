import User, { findOne } from '../schemas/User'
import express from 'express'
import bcrypt from "bcrypt"

const router = express.Router()

router.post("/register", async (req, res) => {
    const { username, password } = req.body
    try {
      const salt = bcrypt.genSaltSync()
  
      if (password.length < 8) {
        res.status(400).json({
          response: "Password must be at least 8 characters long",
          success: false
        })
      } else {
        const newUser = await new User({
          username: username,
          password: bcrypt.hashSync(password, salt)
        }).save()
        res.status(201).json({
          response: {
            username: newUser.username,
            accessToken: newUser.accessToken,
            userId: newUser._id
          },
          success: true
        })
      }
    } catch (error) {
      res.status(400).json({
        response: error,
        success: false
      })
    }
  })
  
  
  router.post("/login", async (req, res) => {
    const { username, password } = req.body
  
    try {
      const user = await findOne({ username })
  
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({
          success: true,
          username: user.username,
          accessToken: user.accessToken,
          userId: user._id
        })
      } else {
        res.status(400).json({
          response: "Sorry, username and password don't match",
          success: false
        })
      }
    } catch (error) {
      res.status(400).json({
        response: error,
        success: false
      })
    }
  })
  

  export default router
