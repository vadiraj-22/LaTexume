import { Router } from 'express'
import { loginUser, logoutUser, registerUser, getCurrentUser } from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

// Public routes
router.route('/register').post(
  upload.single('avatar'), // Optional avatar file
  registerUser
)

router.route('/login').post(loginUser)

// Protected routes (require valid JWT)
router.route('/logout').post(verifyJWT, logoutUser)
router.route('/me').get(verifyJWT, getCurrentUser)

export default router