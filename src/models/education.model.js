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
        type: Number,
        min:1950,
        max: new Date().getFullYear()
    },
    gap:{
        type:String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true})

export const Education = mongoose.model("Education", educationSchema) 