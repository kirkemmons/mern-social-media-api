import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

/* REGISTER USER */
// This function is an Express.js route handler for registering a new user. It receives a request and a response object.
export const register = async (req, res) => {
  try {
    // It extracts various fields from the request body, such as the user's first and last name, email, password, and location.
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body

    // It uses the bcrypt library to generate a salt and hash the user's password.
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    // It then creates a new User object with the extracted fields and the hashed password.
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    })
    // The new User object is then saved to the database and the saved user object is sent back as a JSON response with a status code of 201 (Created).
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  // If an error occurs during the process, it sends a status code of 500 (Internal Server Error) with an error message in the response body.
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/* LOGGING IN */
// This function is a login route handler for an Express.js server. It receives a response and a request object.
export const login = async (req, res) => {
  try {
    // It is designed to handle a login request by checking the email and password provided in the request body against a user in the database.
    const { email, password } = req.body
    // If the user exists and the provided password matches the hashed password in the database,
    const user = await User.findOne({ email: email })
    if (!user) return res.status(400).json({ msg: "User does not exist." })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." })

    // it will generate a JSON web token and send it back in the response along with the user information, with the password removed.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    delete user.password
    res.status(200).json({ token, user })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}