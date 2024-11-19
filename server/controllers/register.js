const User = require("../models/userModel");
const AppError = require("../utils/customError");
const jwt = require("jsonwebtoken");
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, userType } = req.body;
    if (!name || !email || !userType || !password) {
      return next(new AppError("Please fill out all fields", 400));
    }
    const user = await User.create({
      name,
      email,
      password,
      userType,
      // longitude,
      // latitude,
    });

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
exports.getAllUser = async (req, res, next) => {
  try {
    const { userType } = req.body;
    // Validate userType
    if (!userType) {
      return res.status(400).json({
        status: "fail",
        message: "userType is required",
      });
    }

    const lowerCaseUserType = userType.toLocaleLowerCase();

    // Define the opposite userType
    let oppositeUserType;
    if (lowerCaseUserType === "user") {
      oppositeUserType = "rider";
    } else if (lowerCaseUserType === "rider") {
      oppositeUserType = "user";
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Invalid userType provided",
      });
    }

    // Fetch users based on the opposite userType
    const users = await User.find({ userType: oppositeUserType });

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

exports.getUserLocation = async (req, res, next) => {
  try {
    const { id, long, lat } = req.body;

    if (id) {
      // Use findOne() instead of find() to get a single document
      const user = await User.findOne({ _id: id });

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      // Update user's long and lat
      user.long = long;
      user.lat = lat;

      // Save the updated user document
      await user.save();

      res.status(200).json({
        status: "success",
        data: user,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "User ID not provided",
      });
    }
  } catch (err) {
    console.error(err);
    return next(new AppError(err.message, 500));
  }
};
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Please fill out all fields", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({
      status: "success",
      data: user,
      token,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

exports.toggleType = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndUpdate(id, { userType: req.body.userType }, { new: true });
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    console.log(err);
  }
};
