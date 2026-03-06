import {Router} from "express"
import { getUserProfile, login, logout, register, updateProfile } from "../controller/user.controller.js"
import verifyJwt from "../middleware/authJwt.middleware.js"
import { upload } from "../middleware/multer.middlewaer.js"

const router = Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(verifyJwt, logout)
router.route("/profile/update").post(
  verifyJwt,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]),
  updateProfile
)
router.route("/profile").get(verifyJwt, getUserProfile)



export default router