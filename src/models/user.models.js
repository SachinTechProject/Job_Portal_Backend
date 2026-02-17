import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber:{
        type: String,
        required: true, 
    },
    role: {
        type: String,
        enum: ['applicant', 'recruiter', 'admin'],
        default: 'applicant',
    },
    refreshToken:{
        type:String
    },
    profile:{
        bio:{type:String, default:""},
        skills:{type:[String], default:[]},
        resume:{type:String, default:""},
        resumeOriginalName:{type:String, default:""},
        company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null},
        profilePicture:{type:String, default:""},
    }

}, { timestamps: true });

userSchema.pre("save", async function(){
   if(!this.isModified("password")) return 

    this.password = await bcrypt.hash(this.password, 10)
    
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
    {
        _id:this._id,
        email:this.email,
        role:this.role,
        fullName:this.fullName
    },
    process.env.ACCESS_SECRET_TOKEN,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES
    }
   )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_SECRET_TOKEN,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES
        }
    )
}


export const User = mongoose.model('User', userSchema);