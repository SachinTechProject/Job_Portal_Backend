import { Router } from "express";
import verifyJwt from "../middleware/authJwt.middleware.js";
import { createResume, getResume, updateResume } from "../controller/resume.controller.js";


const router = Router()

router.route("/addResume").post(verifyJwt, createResume)
router.route("/getResume/").get(verifyJwt, getResume)
router.route("/update-Resume/:id").put(verifyJwt, updateResume)

export default router