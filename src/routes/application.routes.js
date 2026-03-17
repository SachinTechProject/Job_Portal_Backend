import { Router } from "express"
import { applyJob, getApplications, updateApplicationStatus, getJobApplications } from "../controller/application.controller.js"
import verifyJwt from "../middleware/authJwt.middleware.js"

const router = Router()

router.route("/apply/:jobId").post(verifyJwt, applyJob)
router.route("/my-applications").get(verifyJwt, getApplications)
router.route("/update-status/:applicationId").put(verifyJwt, updateApplicationStatus)
router.route("/job/:jobId").get(verifyJwt, getJobApplications)

export default router
