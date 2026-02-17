import { Router } from "express";
import { deleteCompany, getRegisterCompany, registerCompany, updateCompanyDetails } from "../controller/company.controller.js";
import verifyJwt from "../middleware/authJwt.middleware.js";

const router = Router()

router.route("/register-company").post(verifyJwt, registerCompany)
router.route("/get-companys").get(verifyJwt, getRegisterCompany)
router.route("/updates/companys-details/:id").post(verifyJwt, updateCompanyDetails)
router.route("/delete-company/:id").delete(verifyJwt, deleteCompany)


export default router