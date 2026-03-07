import { Router } from "express";
import verifyJwt from "../middleware/authJwt.middleware.js";
import { addExperience, getExperience, updateExperience } from "../controller/exprience.controller.js";

const router = Router()


router.route("/addExperience").post(verifyJwt, addExperience)
router.route("/getExperience").get(verifyJwt, getExperience)
router.route("/update-experience/:id").put(verifyJwt, updateExperience)

export default router