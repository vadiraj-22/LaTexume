import { Router } from 'express'
import {
  saveResume,
  getUserResumes,
  getResumeById,
  deleteResume,
  togglePublicStatus,
  getPublicResume,
  getPublicResumePdf,
} from '../controllers/resume.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

// Public unauthenticated endpoints
router.get('/public/:id', getPublicResume)
router.get('/public/:id/pdf', getPublicResumePdf)

// Protected endpoints requiring authentication
router.use(verifyJWT)

router.route('/').post(saveResume).get(getUserResumes)
router.route('/:id').get(getResumeById).delete(deleteResume)
router.patch('/:id/toggle-public', togglePublicStatus)

export default router
