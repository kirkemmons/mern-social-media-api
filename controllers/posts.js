import Post from "../models/Post.js"
import User from "../models/User.js"

/* CREATE */
// This function is creating a new post and saving it to a database.
// The function takes in two parameters, res and req, which are the response and request objects from an Express.js route handler.
export const createPost = async (res, req) => {
  try {
    // The function then extracts some information from the request body, such as the `userId`, `description`, and `picturePath`.
    const { userId, description, picturePath } = req.body
    // It then uses the userId to find a user from the database and creates a new post object with information from both the user model and the request body.
    const user = await User.findById(userId)
    const newPost = await new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    })
    // Saves the new post to the database.
    await newPost.save()

    // Retrieves all posts and returns it as json with a status code 201 created.
    const post = await Post.find()
    res.status(201).json(post)

    // Returns with a status code 409 `conflict` error message.
  } catch (err) {
    res.status(409).json({ message: err.message })
  }
}

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    // Retrieves all posts and returns it as json with a status code 200 successful request.
    const post = await Post.find()
    res.status(200).json(post)

    // Returns with a status code 404 `not found` error message.
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const getUserPosts = async (req, res) => {
  try {
    // This function is a route handler for a GET request that retrieves the posts associated with a particular user, identified by their userId.
    const { userId } = req.params
    // The function uses the Mongoose library to query the Post collection in a MongoDB database using the `find` method and returns the post with the given userId.
    const post = await Post.find({ userId })
    res.status(200).json(post)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

/* UPDATE */
// This function is set to handle the logic for liking a post in a web application. It takes in a request object `req` and a response object `res` as parameters.
export const likePost = async (req, res) => {
  try {
    // It retrieves the post ID from the request parameters, and the user ID from the request body.
    const { id } = req.params
    const { userId } = req.body
    // It then attempts to retrieve the post from a database using the Post.findById method,
    const post = await Post.findById(id)
    // and checks if the user has already liked the post by checking the likes property of the post.
    const isLiked = post.likes.get(userId)

    // If the user has already liked the post, it removes the user's like by calling delete method on the post.likes property.
    if (isLiked) {
      post.likes.delete(userId)
      // If the user has not yet liked the post, it adds the user's like by calling set method on the post.likes property.
    } else {
      post.likes.set(userId, true)
    }

    // It then updates the post in the database using the Post.findByIdAndUpdate method and sets the likes property of the post to the updated likes.
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    )

    // The updated post is then returned in the response with a status of 200 `successful request`.
    res.status(200).json(updatedPost)
    // Otherwise a status code 404 `not found` error message is thrown.
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}
