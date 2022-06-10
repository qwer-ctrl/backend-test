import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import listEndpoints from 'express-list-endpoints'

// import authRoute from "./routes/auth"
// import exercisesRoute from "./routes/exercises"
// import programsRoute from "./routes/programs"

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-final'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

const ExerciseSchema = new mongoose.Schema({
	exercise: {
		type: String,
		required: true,
		minlength: [5, 'The name must contain at least 5 letters'],
		maxlength: [20, 'The name can contain maximum 20 letters'],
		trim: true,
	},
	sets: {
		type: String,
	},
	reps: {
		type: String,
	},
	weights: {
		type: String,
	},
	minutes: {
		type: String,
	},
	seconds: {
		type: String,
	},
	exerciseLength: {
		type: String,
	},
	duration: {
		type: String,
	},
	exerciseLink: {
		type: String,
	},
	comments: {
		type: String,
		maxlength: [140, 'The maximum amount of characters is 140'],
		trim: true,
	},
	createdAt: {
		type: Date,
		default: () => new Date(),
	},
})

const Exercise = mongoose.model('Exercise', ExerciseSchema)

app.post('/exercise/:programId', async (req, res) => {
	const { programId } = req.params
	const { exercise, sets, reps, weights, minutes, seconds, exerciseLength, duration, exerciseLink, comments } = req.body

	try {
		const newExercise = await new Exercise({ exercise, sets, reps, weights, minutes, seconds, exerciseLength, duration, exerciseLink, comments }).save()
		const updatedProgram = await Program.findByIdAndUpdate(
			programId,
			{
				$push: {
					exercise: newExercise,
				},
			},
			{ new: true }
		)
		res.status(201).json({
			response: newExercise,
			success: true,
		})
	} catch (error) {
		res.status(400).json({
			response: error,
			success: false,
		})
	}
})

app.get('/exercise/:exerciseId', async (req, res) => {
	const { exerciseId } = req.params

	try {
		const exercise = await Exercise.findById(exerciseId).limit(15)
		res.status(200).json({
			response: exercise,
			success: true,
		})
	} catch (error) {
		res.status(400).json({
			response: 'Could not get exercise',
			success: false,
		})
	}
})

app.patch('/updateexercise/:exerciseId', async (req, res) => {
	const { exerciseId } = req.params
	const { exercise, sets, reps, weights, minutes, seconds, exerciseLength, duration, exerciseLink, comments } = req.body

	try {
		const updatedExercise = await Exercise.findByIdAndUpdate(
			exerciseId,
			{
				$set: {
					exercise,
					sets,
					reps,
					weights,
					minutes,
					seconds,
					exerciseLength,
					duration,
					exerciseLink,
					comments,
				},
			},
			{
				new: true,
			}
		)
		res.status(200).json({ response: updatedExercise, success: true })
	} catch (error) {
		res.status(400).json({ response: error, success: false })
	}
})

app.delete('/deleteexercise/:exerciseId', async (req, res) => {
	const { exerciseId } = req.params

	try {
		const deletedExercise = await Exercise.findByIdAndDelete(exerciseId)
		if (deletedExercise) {
			res.status(201).json({ response: deletedExercise, success: true })
		} else {
			res.status(400).json({ response: 'Exercise not found', success: false })
		}
	} catch (error) {
		res.status(400).json({ reponse: error, success: false })
	}
})

const ProgramSchema = new mongoose.Schema({
	programType: {
		type: String,
		enum: ['weights', 'cardio'],
		required: true,
		lowercase: true,
		trim: true,
	},
	programName: {
		type: String,
		required: true,
		minlength: [5, 'The name must contain at least 5 letters'],
		maxlength: [20, 'The name can contain maximum 20 letters'],
		trim: true,
		unique: true,
	},
	exercise: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Exercise',
		},
	],
	createdAt: {
		type: Date,
		default: () => new Date(),
	},
})

const Program = mongoose.model('Program', ProgramSchema)

app.post('/program/:userId', async (req, res) => {
	const { userId } = req.params
	const { programType, programName } = req.body

	try {
		const newProgram = await new Program({ programType, programName }).save()
		const updatedUser = await User.findByIdAndUpdate(userId, {
			$push: {
				program: newProgram,
			},
		})
		res.status(201).json({
			response: newProgram,
			success: true,
		})
	} catch (error) {
		res.status(400).json({
			response: error,
			success: false,
		})
	}
})

app.post('/updateprogram/:programId', async (req, res) => {
	const { programId } = req.params
	const { programName, programType } = req.body

	try {
		const updatedProgram = await Program.findByIdAndUpdate(
			programId,
			{
				$set: {
					programName: programName,
					programType: programType,
				},
			},
			{
				new: true,
			}
		)
		res.status(200).json({ response: updatedProgram, success: true })
	} catch (error) {
		res.status(400).json({ response: error, success: false })
	}
})

app.delete('/deleteprogram/:programId', async (req, res) => {
	const { programId } = req.params

	try {
		const deletedProgram = await Program.findOneAndDelete(programId)
		if (deletedProgram) {
			res.status(201).json({ response: deletedProgram, success: true })
		} else {
			res.status(400).json({ response: 'Program not found', success: false })
		}
	} catch (error) {
		res.status(400).json({ reponse: error, success: false })
	}
})

app.get('/myprogram/:programId', async (req, res) => {
	const { programId } = req.params

	try {
		const userExercises = await Program.findById(programId).populate('exercise').limit(10)
		res.status(200).json({
			response: userExercises,
			success: true,
		})
	} catch (error) {
		res.status(400).json({
			response: error,
			success: false,
		})
	}
})

const UserSchema = new mongoose.Schema({
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
		default: () => crypto.randomBytes(128).toString('hex'),
	},
	program: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Program',
		},
	],
})

const User = mongoose.model('User', UserSchema)

app.get('/', (req, res) => {
	res.send(listEndpoints(app))
})

app.post('/register', async (req, res) => {
	const { username, password } = req.body
	try {
		const salt = bcrypt.genSaltSync()

		if (password.length < 8) {
			res.status(400).json({
				response: 'Password must be at least 8 characters long',
				success: false,
			})
		} else {
			const newUser = await new User({
				username: username,
				password: bcrypt.hashSync(password, salt),
			}).save()
			res.status(201).json({
				response: {
					username: newUser.username,
					accessToken: newUser.accessToken,
					userId: newUser._id,
				},
				success: true,
			})
		}
	} catch (error) {
		res.status(400).json({
			response: error,
			success: false,
		})
	}
})

app.post('/login', async (req, res) => {
	const { username, password } = req.body

	try {
		const user = await User.findOne({ username })

		if (user && bcrypt.compareSync(password, user.password)) {
			res.status(200).json({
				success: true,
				username: user.username,
				accessToken: user.accessToken,
				userId: user._id,
			})
		} else {
			res.status(400).json({
				response: "Sorry, username and password don't match",
				success: false,
			})
		}
	} catch (error) {
		res.status(400).json({
			response: error,
			success: false,
		})
	}
})

const authenticateUser = async (req, res, next) => {
	const accessToken = req.header('Authorization')

	try {
		const user = await User.findOne({ accessToken: accessToken })
		if (user) {
			next()
		} else {
			res.status(401).json({
				response: 'Please log in',
				success: false,
			})
		}
	} catch (error) {
		res.status(400).json({
			response: error,
			success: false,
		})
	}
}

app.get('/mypage', authenticateUser)
app.get('/mypage/:userId', async (req, res) => {
	const { userId } = req.params
	try {
		const userPrograms = await User.findById(userId).populate('program')
		res.status(200).json({
			response: userPrograms,
			success: true,
		})
	} catch (error) {
		res.status(400).json({
			response: 'Could not get programs',
			success: false,
		})
	}
})

// app.use("./routes/auth", authRoute)
// app.use("/exercises", exercisesRoute)
// app.use("/programs", programsRoute)

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`)
})

// app.post("/user/:userId", async (req, res) => {
// const { program } = req.body
// try {
//   const queriedProgram = await Program.findById(program)
//   const newProgram = await new User({program: queriedProgram}).save();
//   res.status(201).json({
//     response: newProgram,
//     success: true
//   })
// } catch(error) {
//   res.status(400).json({
//     response: error,
//     success: false
//   })
// }
// })
