import mongoose from "mongoose"

const companySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String
    },

    website: {
        type: String,
        required: true,
        unique: true
    },

    location: {
        type: String,
        required: true
    },

    logo: {
        type: String
    },

    industry: {
        type: String
    },

    companySize: {
        type: String   // ex: "1-10", "11-50", "50-200"
    },

    foundedYear: {
        type: Number
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    totalJobsPosted: {
        type: Number,
        default: 0
    },

    totalApplicationsReceived: {
        type: Number,
        default: 0
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application"
        }
    ]

}, { timestamps: true })

export const Company = mongoose.model("Company", companySchema)