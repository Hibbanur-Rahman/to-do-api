const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const httpStatusCode = require("../constant/httpStatusCode");
const UserModel = require("../models/userModel");
const { getToken } = require("../middleware/authMiddleware");

const register = async (req, res) => {
  try {
    // Validate incoming request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { username, email, password } = req.body;

    console.log("username,email,password",username,email,password)
    // Check if user with provided email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(httpStatusCode.CONFLICT).json({
        success: false,
        message: "User is already registered with this email. Please sign in.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await UserModel.create({ username, email, password: hashedPassword });

    // // Generate token
    // const token = await getToken(user._id);

    return res.status(httpStatusCode.CREATED).json({
      success: true,
      message: "User registered successfully!",
      data: { user },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate incoming request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        errors: errors.array(),
      });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(httpStatusCode.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or user is unauthorized. Please register first!",
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(httpStatusCode.UNAUTHORIZED).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate token
    const token = await getToken(user);

    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "Successfully logged in!",
      data: { user, access_token:token },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};
