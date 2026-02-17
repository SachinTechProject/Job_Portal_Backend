import { Job } from "../models/job.model.js"
import { User } from "../models/user.models"


const createJob = async (req, res)=>{
    try {

        const {title, description, salary,location,jobType, position, companyId} = req.body


        if(!title || !description || !salary || !location || !jobType || !position){
            return res.status(400).json("All filed must be required")
        }

        const job = await Job.findOne({title, company: companyId})

        if(job){
            return res.status(400).json({message:"Job title with company is allready exist !!"})
        }

       const newjob = new Job.create({
            title,
            description,
            salary,
            location,
            jobType,
            position,
            company: companyId
       }) 

       return res.status(200).json({message:"Job created", newjob})
        
    } catch (error) {
        console.log("Server error", error)
        return res.status(500).json({message:"Server error"})
    }
}

export { createJob }