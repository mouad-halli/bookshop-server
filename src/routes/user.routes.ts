import { Router } from 'express'
import userControllers from '../controllers/user.controller'
import { verifyAuthentication } from '../middlewares/verifyAccessToken.middleware'
// import { multerOptions } from '../config/multer'
// import multer from 'multer'
import { validateBody } from '../middlewares/validateBody.middleware'
import { validateUpdateUserInformation, validateUpdateUserPassword } from '../validations/updateUserValidation'

const router  = Router()

// const upload = multer(multerOptions)

router.get('/me', verifyAuthentication, userControllers.getMe)

router.put('/information', verifyAuthentication, validateBody(validateUpdateUserInformation), userControllers.updateUserInformation)

router.put('/password', verifyAuthentication, validateBody(validateUpdateUserPassword), userControllers.updateUserPassword)

// router.put('/upload/image', verifyAuthentication, upload.single('image'), userControllers.updateUserImage)

export default router