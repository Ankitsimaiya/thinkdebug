import express from "express"
import { creatOrg, loginUser, registerUser } from "../controller/user.controllers.js"

const router = express.Router()

router.post("/signup",registerUser)
router.post("/login",loginUser)
router.post("/org",creatOrg)

export default router ; 