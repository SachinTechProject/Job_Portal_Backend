import mongoose from "mongoose";

const jobScehama = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    requirements: [{
        type: String,
        required: true
    }],
    salary:{
        type: String,
        required: true, 
    },
    location:{
        type: String,
        required: true,
    },
    jobType:{
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
        required: true,
    },
    position:{
        type: String,
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
    }],
    

}, { timestamps: true });

export const Job = mongoose.model('Job', jobScehama);
