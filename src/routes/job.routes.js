import { Router } from "express";
import verifyJwt from "../middleware/authJwt.middleware.js";
import { createJob, deleteJob, getAllJobs, updateJob } from "../controller/job.controller.js";

const router = Router()

// Public - anyone can view all jobs (no auth required)
router.route("/getAllJobs").get(getAllJobs)

// Authenticated routes - recruiter/admin only
router.route("/createjob").post(verifyJwt, createJob)
router.route("/updatejob/:id").put(verifyJwt, updateJob)
router.route("/deletejob/:id").delete(verifyJwt, deleteJob)

export default router