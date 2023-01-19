import jwt from "jsonwebtoken"

// This function is an Express middleware that verifies a JSON Web Token (JWT) passed in the Authorization header of an incoming request.
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")

    // The function first checks if the header is present, and if not, sends a "Access Denied" response with a 403 status code.
    if (!token) {
      return res.status(403).send("Access Denied")
    }

    // If the header is present, it checks if it starts with "Bearer " and removes it.
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft()
    }

    // Then, it uses the 'jwt' library to verify the token with a secret passed in an environment variable (process.env.JWT_SECRET), and if the token is verified,
    // it attaches the payload of the token to the request object (req.user) and calls the next middleware.
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified
    next()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
