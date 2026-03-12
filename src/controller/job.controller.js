// import { Job } from "../models/job.model.js"


// const createJob = async (req, res)=>{
//     try {
//         if (req.user.role !== "recruiter" && req.user.role !== "admin") {
//     return res.status(403).json({ message: "Only recruiter or admin can create job" });
// }


//         const {title, description, requirements, salary,location,jobType, position, companyId} = req.body


//         if(!title || !description || !requirements || !salary || !location || !jobType || !companyId || !position){
//             return res.status(400).json("All filed must be required")
//         }

//         const job = await Job.findOne({title, company: companyId})

//         if(job){
//             return res.status(400).json({message:"Job title with company is allready exist !!"})
//         }

//        const newjob = await Job.create({
//             title,
//             description,
//             salary,
//             location,
//             jobType,
//             position,
//             requirements,
//             company: companyId,
//             createdBy: req.user._id
//        }) 

//        return res.status(201).json({message:"Job created", newjob})
        
//     } catch (error) {
//         console.log("Server error", error)
//         return res.status(500).json({message:"Server error"})
//     }
// }


// const updateJob = async (req, res)=>{
//     if (req.user.role !== "recruiter" && req.user.role !== "admin") {
//     return res.status(403).json({ message: "Only recruiter or admin can create job" });
//     }


   
//    try {
//      const {title, requirements, description, salary,location,jobType, position} = req.body
//      const {id} = req.params
 
//      const job = await Job.findOneAndUpdate(
//          {_id: id, createdBy: req.user._id},
//          {
//               title,
//              description,
//              salary,
//              location,
//              jobType,
//              position,
//              requirements,
            
//          },
//          {
//              new: true
//          }
     
//      )
 
//      if(!job){
//         console.log("job error")
//          return res.status(400).json({message:"Job not found !!"})
//      }
 
//      return res.status(200).json({message:"Job profile is updated !!", job})
//    } catch (error) {
//       console.log("Server error", error)
//       return res.status(500).json({message:"Server error", error})
//    }
// }


// const deleteJob = async (req, res)=>{
//   if (req.user.role !== "recruiter" && req.user.role !== "admin") {
//     return res.status(403).json({ message: "Only recruiter or admin can create job" });
// }
//     try {
//         const {id} = req.params

//         const job = await Job.findOneAndDelete({_id: id, createdBy: req.user._id})
//     } catch (error) {
//         console.log("Server error", error)
//         return res.status(500).json({message:"Server error"})
//     }

// }

// const getAllJobs = async (req, res) => {
//     try {
//         const jobs = await Job.find()
//             .populate({
//                 path: "company",
//                 select: "name website location logo"
//             })
//             .populate({
//                 path: "createdBy",
//                 select: "fullName email"
//             })

//         if (!jobs || jobs.length === 0) {
//             return res.status(200).json({ message: "No jobs found", jobs: [], success: true })
//         }

//         return res.status(200).json({ message: "All Jobs", jobs, success: true })

//     } catch (error) {
//         console.log("Server error", error)
//         return res.status(500).json({ message: "Server error", error, success: false })
//     }
// }

// export { createJob , updateJob, deleteJob, getAllJobs}










import mongoose from "mongoose";
import { Job } from "../models/job.model.js";

/* ================= CREATE JOB ================= */

const createJob = async (req, res) => {
  try {
    if (req.user.role !== "recruiter" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only recruiter or admin can create job" });
    }

    const {
      title,
      description,
      requirements,
      skills,
      salary,
      experience,
      education,
      location,
      jobType,
      workMode,
      position,
      openings,
      benefits,
      applicationDeadline,
      companyId
    } = req.body;

    if (!title || !description || !location || !jobType || !position ) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // prevent duplicate job title for same company
    const existingJob = await Job.findOne({ title, company: companyId });

    if (existingJob) {
      return res.status(400).json({
        message: "Job with this title already exists for this company",
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements,
      skills,
      salary,
      experience,
      education,
      location,
      jobType,
      workMode,
      position,
      openings,
      benefits,
      applicationDeadline,
      company: companyId,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      message: "Job created successfully",
      job,
      success: true,
    });

  } catch (error) {
    console.error("Create Job Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

/* ================= UPDATE JOB ================= */

const updateJob = async (req, res) => {
  try {
    if (req.user.role !== "recruiter" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only recruiter or admin can update job" });
    }

    const { id } = req.params;

    const updatedJob = await Job.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { $set: req.body },   // update only provided fields
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        message: "Job not found or unauthorized",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
      success: true,
    });

  } catch (error) {
    console.error("Update Job Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

/* ================= DELETE JOB ================= */

const deleteJob = async (req, res) => {
  try {
    if (req.user.role !== "recruiter" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only recruiter or admin can delete job" });
    }

    const { id } = req.params;

    const job = await Job.findOneAndDelete({
      _id: id,
      createdBy: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found or unauthorized",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Job deleted successfully",
      success: true,
    });

  } catch (error) {
    console.error("Delete Job Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

/* ================= GET ALL JOBS ================= */

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate({
        path: "company",
        select: "name website location logo",
      })
      .populate({
        path: "createdBy",
        select: "fullName email",
      })
      .sort({ createdAt: -1 });

      if(!jobs){
         return res.status(404).json({message:"Job not Found"})
      }

    return res.status(200).json({
      message: "All jobs fetched successfully",
      jobs,
      totalJobs: jobs.length,
      success: true,
    });

  } catch (error) {
    console.error("Get Jobs Error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const getJobById = async (req, res)=>{
  try {
    const { id } = req.params


     if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Job ID" });
    }
    const jobs = await Job.findById(id)
    
       if(!jobs){
         return res.status(404).json({message:"Job not Found"})
      }

      return res.status(200).json({
      message: "All jobs fetched by Id successfully",
      jobs,
      totalJobs: jobs.length,
      success: true,
    });
  } catch (error) {
    console.log("server error", error)
    return res.status(500).json({message:"Server error", error})
  }
}

export { createJob, updateJob, deleteJob, getJobById, getAllJobs };