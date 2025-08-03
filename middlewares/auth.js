import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "Login First!" });
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decodedData._id).select("-password");
  if (!user) {
    return res.status(401).json({ message: "User not found!" });
  }
  req.user = user;
  next();
};
