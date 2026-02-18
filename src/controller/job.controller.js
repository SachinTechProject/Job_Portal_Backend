import { Job } from "../models/job.model.js"


const createJob = async (req, res)=>{
    try {
        if (req.user.role !== "recruiter" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only recruiter or admin can create job" });
}


        const {title, description, requirements, salary,location,jobType, position, companyId} = req.body


        if(!title || !description || !requirements || !salary || !location || !jobType || !companyId || !position){
            return res.status(400).json("All filed must be required")
        }

        const job = await Job.findOne({title, company: companyId})

        if(job){
            return res.status(400).json({message:"Job title with company is allready exist !!"})
        }

       const newjob = await Job.create({
            title,
            description,
            salary,
            location,
            jobType,
            position,
            requirements,
            company: companyId,
            createdBy: req.user._id
       }) 

       return res.status(201).json({message:"Job created", newjob})
        
    } catch (error) {
        console.log("Server error", error)
        return res.status(500).json({message:"Server error"})
    }
}


const updateJob = async (req, res)=>{
    if (req.user.role !== "recruiter" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only recruiter or admin can create job" });
    }


   
   try {
     const {title, requirements, description, salary,location,jobType, position} = req.body
     const {id} = req.params
 
     const job = await Job.findOneAndUpdate(
         {_id: id, createdBy: req.user._id},
         {
              title,
             description,
             salary,
             location,
             jobType,
             position,
             requirements,
            
         },
         {
             new: true
         }
     
     )
 
     if(!job){
        console.log("job error")
         return res.status(400).json({message:"Job not found !!"})
     }
 
     return res.status(200).json({message:"Job profile is updated !!", job})
   } catch (error) {
      console.log("Server error", error)
      return res.status(500).json({message:"Server error", error})
   }
}


const deleteJob = async (req, res)=>{
  if (req.user.role !== "recruiter" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only recruiter or admin can create job" });
}
    try {
        const {id} = req.params

        const job = await Job.findOneAndDelete({_id: id, createdBy: req.user._id})
    } catch (error) {
        console.log("Server error", error)
        return res.status(500).json({message:"Server error"})
    }

}

const getAllJobs = async (req, res)=>{

    try {
        
        const jobs = await Job.find()

        if(!jobs){
            return res.status(400).json({message:"Some thing went wrong !!"})
        }

        return res.status(201).json({message:"All Jobs", jobs})

    } catch (error) {
        console.log("Server error", error)
        return res.status(500).json({message:"Server error", error})
    }
}

export { createJob , updateJob, deleteJob, getAllJobs}