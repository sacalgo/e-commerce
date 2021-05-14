import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler";
import User from "../models/userModel.js";
import ResponseStatus from "../utils/responseStatus";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (err) {
      console.error(err);
      res.status(ResponseStatus.UNAUTHORIZED);
      throw new Error("Not authorized, token failed");
    }
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(ResponseStatus.UNAUTHORIZED);
    throw new Error("Not authorized as an admin");
  }
};

export { protect, admin };
