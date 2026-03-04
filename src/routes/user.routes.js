import {Router} from "express"
import { getUserProfile, login, logout, register, updateProfile } from "../controller/user.controller.js"
import verifyJwt from "../middleware/authJwt.middleware.js"

const router = Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(verifyJwt, logout)
router.route("/profile/update").post(verifyJwt, updateProfile)
router.route("/profile").get(verifyJwt, getUserProfile)



export default router