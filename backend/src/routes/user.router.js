import express from "express"
import {registerUser,loginUser,logoutUser,getUserProfile,updateUserAccount} from "../controllers/auth.controller.js"
import {authMiddleware} from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post('/registerUser', registerUser);
router.post('/loginUser', loginUser);

router.post('/logoutUser',logoutUser)
router.get('/profile', authMiddleware, getUserProfile)
router.put('/account', authMiddleware, updateUserAccount)

export default router;