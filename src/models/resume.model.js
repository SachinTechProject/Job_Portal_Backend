import mongoose, { Mongoose } from "mongoose";


const resumeSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique: true
    },
    phoneNumber: {
        type: Number,
    },
    dateOfBirth:{
        type: Date
    },
    currentLocation:{
        type:String
    },
    linkedinUrl:{
        type:String
    },
    githubUrl:{
        type:String
    },
    projects:{
        type:String
    },
    education:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Education" 
    }],
    skills:[{ type: Sting }],
    certifications: [{ type: String }],
    preferredJobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary', 'remote'],
    },
    preferredLocation: [{ type: String }],
    expectedSalary: { type: String },
    availability: { type: String },
    resumeUrl: { type: String },
    portfolioUrl: { type: String },
    professionalSummary: { type: String },
},{timestamps:true})

export const Resume = mongoose.model("Resume", resumeSchema)