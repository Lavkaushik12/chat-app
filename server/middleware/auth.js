import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to protect routes
export const protectRoute = async(req,res,next)=>{
  try {
    
    const token = req.headers.token;
    if(!token){
      return res.status(401).json({success: false, message: "Unauthorized: No token provided"});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if(!decoded){
      return res.status(401).json({success: false, message: "Unauthorized: Invalid token"});
    }

    // FIX: Use the 'decoded' variable to get the userId
    const user = await User.findById(decoded.userId).select("-password");

    if(!user){
      return res.status(404).json({success: false, message: "User not found"});
    }

    req.user = user;
    next();

  } catch (error) {
    console.log(error.message);
    res.status(500).json({success: false, message: error.message});
  }
}