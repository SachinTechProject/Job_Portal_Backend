import { Router } from "express";
import verifyJwt from "../middleware/authJwt.middleware.js";
import { searchJobs } from "../controller/serchJob.controller.js";

const router = Router()

router.route("/search").get(verifyJwt, searchJobs)


export default router