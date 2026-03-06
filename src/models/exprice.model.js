import mongoose from "mongoose";


const exprienceSchema = new mongoose.Schema({
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
    }
},{timestamps:true})

export const Exprience = mongoose.model("Exprience", exprienceSchema)