import mongoose from "mongoose";


const experienceSchema = new mongoose.Schema({
    jobTitle:{
        type:String,
        // required: true
    },
    company: {
        type:String,
        // required: true
    },
    location:{
        type:String
    },
    startDate:{
        type:Date
    },
    endDate:{
        type: Date
    },
    description: {
        type: String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Experience = mongoose.model("Experience", experienceSchema)