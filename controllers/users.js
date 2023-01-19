import User from "../models/User.js"

/* READ */
// This function appears to be an exported constant named "getUser" that takes in a request (req) and a response (res) object as arguments.
export const getUser = async (req, res) => {
  try {
    // Inside the function, it attempts to find a user by their id in the request's parameters, using the mongoose findById method from the User model.
    const { id } = req.params
    const user = await User.findById(id)
    // If the user is found, it sends a status code of 200 and the user as a JSON object in the response.
    res.status(200).json(user)

    // If an error is caught, it sends a status code of 404 and an error message in the response as a JSON object.
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

// This function exports a constant named getUserFriends, which is an asynchronous function that takes in two parameters: `req` and `res`.
export const getUserFriends = async (req, res) => {
  try {
    // The function first tries to extract the id parameter from the `req` object's `params` property.
    const { id } = req.params
    // Then, it uses this `id` to find a user document in the database using the `User.findById()` method.
    const user = await User.findById(id)

    // After that, it maps over the user's `friends` array and for each id, it finds the friend's document using `User.findById()` method and returns array of friends.
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    )

    // Then, it formats the returned friends data by selecting specific properties from the friend's document and returning an object containing those properties.
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }
      }
    )

    // Finally, it sends a JSON response with a status code of 200 and the formatted friends data,
    res.status(200).json(formattedFriends)

    // Otherwise, sends a JSON response with a status code of 404 and the error message.
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

/* UPDATE */
// This function is an asynchronous function that exports a constant named "addRemoveFriend" and takes in two parameters, "req" and "res".
export const addRemoveFriend = async (req, res) => {
  try {
    // It finds a user by their ID and a friend by their friend ID,
    const { id, friendId } = req.params
    const user = await User.findById(id)
    const friend = await User.findById(friendId)

    // and then checks whether the user's friends list includes the friend's ID.
    if (user.friends.includes(friendId)) {
      // If it does, it removes the friend's ID from the user's and friend's friends list,
      user.friends = user.friends.filter((id) => id !== friendId)
      friend.friends = friend.friends.filter((id) => id !== id)
      // otherwise it adds the friend's ID to the user's and friend's friends list.
    } else {
      user.friends.push(friendId)
      friend.friends.push(id)
    }
    // Then it saves the changes to the user and friend's data.
    await user.save()
    await friend.save()

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    )

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }
      }
    )

    res.status(200).json(formattedFriends)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}
