import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// import crypto from "crypto"
// import bcrypt from "bcrypt"
// import listEndpoints from "express-list-endpoints";

// import authRoute from "./routes/auth"
import exercisesRoute from "./routes/exercises"
import programsRoute from "./routes/programs"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-final";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


// const ProgramSchema = new mongoose.Schema({
//   programType: {
//     type: String,
//     enum: ['Weights', 'Cardio'],
//     required: true,
//   },
//   // exercise: [ExerciseSchema],
//   createdAt: {
//     type: Date,
//     default: () => new Date()
//   }
// })

// const UserSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   accessToken: {
//     type: String,
//     default: () => crypto.randomBytes(128).toString("hex")
//   },
//   program: [ProgramSchema]
// })



// const Program = mongoose.model('Program', ProgramSchema)
// const User = mongoose.model('User', UserSchema)

// // Start defining your routes here
// app.get("/", (req, res) => {
//   res.send(listEndpoints(app));
// });


// app.post("/register", async (req, res) => {
//   const { username, password } = req.body
//   try {
//     const salt = bcrypt.genSaltSync()

//     if (password.length < 8) {
//       res.status(400).json({
//         response: "Password must be at least 8 characters long",
//         success: false
//       })
//     } else {
//       const newUser = await new User({
//         username: username,
//         password: bcrypt.hashSync(password, salt)
//       }).save()
//       res.status(201).json({
//         response: {
//           username: newUser.username,
//           accessToken: newUser.accessToken,
//           userId: newUser._id
//         },
//         success: true
//       })
//     }
//   } catch (error) {
//     res.status(400).json({
//       response: error,
//       success: false
//     })
//   }
// })


// app.post("/login", async (req, res) => {
//   const { username, password } = req.body

//   try {
//     const user = await User.findOne({ username })

//     if (user && bcrypt.compareSync(password, user.password)) {
//       res.status(200).json({
//         success: true,
//         username: user.username,
//         accessToken: user.accessToken,
//         userId: user._id
//       })
//     } else {
//       res.status(400).json({
//         response: "Sorry, username and password don't match",
//         success: false
//       })
//     }
//   } catch (error) {
//     res.status(400).json({
//       response: error,
//       success: false
//     })
//   }
// })


// const authenticateUser = async (req, res, next) => {
//   const accessToken = req.header("Authorization")

//   try {
//     const user = await User.findOne({ accessToken: accessToken })
//     if (user) {
//       next()
//     } else {
//       res.status(401).json({
//         response: "Please log in",
//         success: false
//       })
//     }
//   } catch (error) {
//     res.status(400).json({
//       response: error,
//       success: false
//     })
//   }
// }

// app.get("/mypage", authenticateUser)
// app.get("/mypage", async (req, res) => {
//   const {program} = req.body
//   try {
//     const mypage = await User.find({})
//     res.status(200).json({
//       response: program,
//       success: true 
//     }) 
//   } catch(error) {
//     res.status(400).json({
//       response: 'Could not get programs',
//       success: false
//     })
//   }
// })

// app.post("/programs", async (req, res) => {
//   const {programType} = req.body
//   try {
//     const newProgram = await new Program({programType}).save();
//     res.status(201).json({
//       response: newProgram,
//       success: true
//     })
//   } catch(error) {
//     res.status(400).json({
//       response: error, 
//       success: false
//     })
//   }
// })

// app.get("/programs", authenticateUser)
// app.get("/programs", async (req, res) => {
//   try {
//     const programs = await Program.find({})
//     res.status(200).json({
//       response: programs,
//       success: true 
//     }) 
//   } catch(error) {
//     res.status(400).json({
//       response: 'Could not get programs',
//       success: false
//     })
//   }
// })

// app.use("./routes/auth", authRoute)
app.use("./routes/exercises", exercisesRoute)
app.use("/routes/programs", programsRoute)

// const ExerciseSchema = new mongoose.Schema({
//   exercise: {
//     type: String, 
//     required: true,
//   },
//   // metrics: {
//   //   type: String,
//   //   required: true,
//        enum: ['set', 'reps', 'weights]
//   // }
// })

// const Exercise = mongoose.model('Exercise', ExerciseSchema)

// app.post("/exercises", async (req, res) => {
//   const {exercise} = req.body
//   try {
//     const newExercise = await new Exercise.find({exercise}).save();
//     res.status(200).json({
//       response: newExercise,
//       success: true
//     })
//   } catch(error) {
//     res.status(400).json({
//       response: error, 
//       success: false
//     })
//   }
// })

// app.get("/exercises", async (req, res) => {
//   try {
//     const exercises = await Exercise.find({})
//     res.status(200).json({
//       response: exercises,
//       success: true 
//     }) 
//   } catch(error) {
//     res.status(400).json({
//       response: 'Could not get exercise',
//       success: false
//     })
//   }
// })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

