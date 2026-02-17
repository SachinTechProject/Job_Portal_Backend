import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"

const verifyJwt =  async(req,res,next)=>{

    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");

        if(!token){
          return res.status(401).json({message:"UnAthorized user"})
        }

        const decodedToken =  jwt.verify(token, process.env.ACCESS_SECRET_TOKEN)

        const user = await User.findById(decodedToken._id).select("-password")

        if(!user){
            return res.status(403).json({message:"Invalid access token"})
        }

        req.user = user
        next()
    } catch (error) {
        console.log("JWT verification error:", error.message)
        return res.status(401).json({message:"Invalid or expired token"})
    }
}

export default verifyJwt