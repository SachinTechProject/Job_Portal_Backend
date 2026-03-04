import { User } from "../models/user.models.js"


const register =  async(req, res)=>{

    if (!req.body) {
        return res.status(400).json({message:"Request body is empty"})
    }

    const {fullName, password, email,role, phoneNumber} = req.body

    if(!fullName || !password || !email || !role || !phoneNumber){
       return res.status(401).json({message:"All Field must be required"})
    }

    try {
        
        const user = await User.findOne({email})

        if(user){
            return res.status(402).json({message:"User Allready exist"}) 
        }

        const newUser = new User({
            fullName,password,email, role, phoneNumber
        })

        await newUser.save()

        return res.status(200).json({message:"User Registered sucessfully", newUser})

    } catch (error) {
        console.log("server error", error)
        return res.status(503).json({message:"sever error", error})
    }
}  


const login = async (req,res)=>{

     try {
    // Handle undefined req.body
    if (!req.body) {
        return res.status(400).json({message:"Request body is empty"})
    }

     const { password, email,role,} = req.body

    if(!email || !password || !role){
        return res.status(400).json({message:"All field must be required"})
    }

   
        
        let user = await User.findOne({email})

        if(!user){
            return res.status(402).json({message:"Invalid Email or Password"})
        }

        const isPasswordCorrect = await user.isPasswordCorrect(password)
        
        if(!isPasswordCorrect){
            return res.status(402).json({message:"Invalid Password or Email"})
        }

        const accessToken = user.generateAccessToken()
        const refreshtoken = user.generateRefreshToken()
      
        if(role != user.role){
            return res.status(400).json({message:"Account dosen't exit with current role"})
        }
        const options  = {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
        }

        user = {
            _id : user._id,
            fullName: user.fullName,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile,
            refreshtoken: user.refreshToken
        }

        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshtoken, options)
        .json({message:"User Login Successfully", user, accessToken})

    } catch (error) {
        console.log("server error", error)
        return res.status(503).json({message:"server error", error})
    }

}

const logout = async(req,res)=>{

   await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )


     const options  = {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
        }
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({message:"User Logout Successfully"})

}

const getUserProfile = async(req, res)=>{

    try {
        const id = req.user._id
        const user = await User.findById(id).select("-password");
        res.status(201).json({message:"Current User", user})
    } catch (error) {
        console.log("Server error", error)
        res.status(500).json({message:"Server error", error})
    }
}

const updateProfile = async(req,res)=>{

    try {
        const {fullName, email, phoneNumber, bio, skills} = req.body
        const file = req.file
        // if(!fullName || !email || !phoneNumber || !bio || !skills){
        //     return res.status(400).json({message:"Something is missing!", success: false})
        // }

        let skillsArray
        if(skills){

         skillsArray = skills.split(",")
        }

        const userId = req.user._id
        let user = await User.findById(userId)

        if(!user){
            return res.status(400).json({message:"User not found", success: false})
        }

        // updating the data

       
       if(fullName) user.fullName = fullName
       if(email )user.email = email
       if(phoneNumber) user.phoneNumber = phoneNumber
       if(bio) user.profile.bio = bio
       if(skills) user.profile.skills = skillsArray

     
        await user.save()

           user = {
            _id : user._id,
            fullName: user.fullName,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile,
            refreshtoken: user.refreshToken
        }

        return res.status(200).json({
            message: "Profile Updated Successfully",
            success: true,
            user: user
        })

    } catch (error) {
        console.log("server error", error)
        return res.status(500).json({message:"Sever error", error})
    }
}



export { register , login , updateProfile, logout, getUserProfile} 