import mongoose from "mongoose"

const educationSchema = new mongoose.Schema({
    degree:{
        type: String,
        required: true
    },
    field:{
        type: String,
        required: true
    },
    university: {
        type: String,
        required: true 
    },
    year:{
        type: Number
    },
    gap:{
        type:String
    }
},{timestamps:true})

export const Education = mongoose.model("Education", educationSchema) 