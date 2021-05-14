import asyncHandler from "../middleware/asyncHandler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import ResponseStatus from "../utils/responseStatus.js";

//@desc  Auth & get token
//@route POST /api/users/login
//@access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const isMatch = await user.matchPassword(password);
    if (user && isMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(ResponseStatus.UNAUTHORIZED);
      throw new Error("Invalid email or password");
    }
  } catch (err) {
    res.status(ResponseStatus.UNAUTHORIZED);
    throw new Error("Invaid email or password");
  }
});

//@desc  Register a new user
//@route POST /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(ResponseStatus.BAD_REQUEST);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(ResponseStatus.CREATED).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(ResponseStatus.BAD_REQUEST);
    throw new Error("Invalid user data");
  }
});

//@desc  Get user profile
//@route GET /api/users/profile
//@access Private
const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    }
  } catch (error) {
    res.status(ResponseStatus.NOT_FOUND);
    throw new Error("User not found");
  }
});

//@desc  Update user profile
//@route PUT /api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(ResponseStatus.NOT_FOUND);
    throw new Error("User not found");
  }
});

//@desc  Get all users
//@route GET /api/users
//@access Private/Admin only
const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(ResponseStatus.INTERNAL_ERROR);
    throw new Error("Internal Server Error");
  }
});

//@desc  Delete user
//@route DEKET /api/users/:id
//@access Private/Admin only
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.remove();
      res.json({ message: "User removed" });
    }
  } catch (error) {
    res.status(ResponseStatus.NOT_FOUND);
    throw new Error("User not found");
  }
});

//@desc  Get user by ID
//@route GET /api/users/:id
//@access Private/Admin only
const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.json(user);
    }
  } catch (error) {
    res.status(ResponseStatus.NOT_FOUND);
    throw new Error("User not found");
  }
});

//@desc  Update user
//@route PUT /api/users/:id
//@access Private /admin only
const updateUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      user.isAdmin = req.body.isAdmin || user.isAdmin;

      const updatedUser = await user.save();
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    }
  } catch (error) {
    res.status(ResponseStatus.NOT_FOUND);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
