import { Job } from "../models/job.model"



const applyJob = async (req, res)=>{
    try {
        const userId = req.user._id
        const jobId = req.params

        const job = await Job.findById(jobId)
        if(!job){
            return res.status(400).json({message:"jobId not found"})
        }

        const existing = await Application.findOne({job: jobId, application: userId})
  if(existing) return res.status(400).json({message:"You have already applied to this job"})

    const application = await Application.create({
      job: jobId,
      application: userId
    })

    // Add to Job applicants array
    job.applicants.push(application._id)
    await job.save()

    return res.status(201).json({message:"Applied successfully", application})


    } catch (error) {
        console.log("Server error", error)
        return res.status(500).json({message:"Server error", error})
    }
}