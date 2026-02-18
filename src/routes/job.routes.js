import { Router } from "express";
import verifyJwt from "../middleware/authJwt.middleware.js";
import { createJob, deleteJob, getAllJobs, updateJob } from "../controller/job.controller.js";

const router = Router()


router.route("/createjob").post(verifyJwt, createJob)
router.route("/updatejob/:id").put(verifyJwt, updateJob)
router.route("/deletejob/:id").delete(verifyJwt, deleteJob)
router.route("/getAllJobs").get(verifyJwt, getAllJobs)

export default router