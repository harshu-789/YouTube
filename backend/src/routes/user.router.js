import express from "express"
import {registerUser,loginUser,logoutUser,getUserProfile,updateUserAccount} from "../controllers/auth.controller.js"
import {authMiddleware} from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post('/registerUser', registerUser);
router.post('/loginUser', loginUser);

router.get('/logoutUser',logoutUser)
router.get('/getUserProfile', authMiddleware, getUserProfile)
router.put('/updateUserAccount', authMiddleware, updateUserAccount)

export default router;