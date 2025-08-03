import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exists" });
    }

    const newUser = await User.create({ username, email, password });

    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);

    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: "true",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({
        success: true,
        msg: `welcome ${newUser.username}`,
      });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message || "Server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid email or password" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: "true",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        msg: `welcome back ${user.username}`,
      });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message || "Server error",
    });
  }
};

export const getProfile = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      secure: "true",
      sameSite: "none",
      maxAge: 0,
    })
    .json({ success: true, msg: "Logged out successfully" });
};
