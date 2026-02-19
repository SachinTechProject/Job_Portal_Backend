import { Router } from "express"
import { applyJob, getApplications, updateApplicationStatus, getJobApplications } from "../controller/application.controller.js"
import verifyJwt from "../middleware/authJwt.middleware.js"

const router = Router()

// User applies for a job (authenticated)
router.route("/apply/:jobId").post(verifyJwt, applyJob)

// User views their own applications (authenticated)
router.route("/my-applications").get(verifyJwt, getApplications)

// Recruiter/Admin updates application status (authenticated)
router.route("/update-status/:applicationId").put(verifyJwt, updateApplicationStatus)

// Recruiter/Admin views all applications for their job (authenticated)
router.route("/job/:jobId").get(verifyJwt, getJobApplications)

export default router
