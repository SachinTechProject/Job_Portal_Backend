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
    const jobs = await Job.findById(id).populate("company");
    
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