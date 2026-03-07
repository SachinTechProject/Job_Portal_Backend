import { Router } from "express";
import verifyJwt from "../middleware/authJwt.middleware.js";
import { addEducation, getEducation, updateEducation } from "../controller/education.controller.js";

const router = Router()

router.route("/addEducation").post(verifyJwt, addEducation)
router.route("/getEducation").get(verifyJwt, getEducation)
router.route("/update-education/:id").put(verifyJwt, updateEducation)

export default router