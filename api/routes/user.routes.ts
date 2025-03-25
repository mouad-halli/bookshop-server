import { Router } from 'express'
import userControllers from '../controllers/user.controller'
import { verifyAuthentication } from '../middlewares/verifyAccessToken.middleware'
// import { multerOptions } from '../config/multer'
// import multer from 'multer'
import { validateBody, validateQuery } from '../middlewares/validateBody.middleware'
import { validateUpdateUserInformation, validateUpdateUserPassword, validateUpsertUserAddress } from '../validations/updateUserValidation'
import Joi from 'joi'
import { validator } from '../validations/validator'

const router  = Router()

// const upload = multer(multerOptions)

router.get('/me', verifyAuthentication, userControllers.getMe)

router.get('/sellers', validateQuery(validator(Joi.object().keys({
    sellers_limit: Joi.number().min(0).max(10).optional(),
    books_limit: Joi.number().min(0).max(30).optional()
}), { abortEarly: false })), userControllers.getUsersWithLastAddedBooks)

router.get('/address', verifyAuthentication, userControllers.getUserAddress)

router.put('/information', verifyAuthentication, validateBody(validateUpdateUserInformation), userControllers.updateUserInformation)

router.put('/is-seller', verifyAuthentication, validateBody(validator(Joi.object({
    isSeller: Joi.boolean().required()
}), { abortEarly: true })), userControllers.updateUserSellerStatus)

router.put('/password', verifyAuthentication, validateBody(validateUpdateUserPassword), userControllers.updateUserPassword)

router.put('/address', verifyAuthentication, validateBody(validateUpsertUserAddress), userControllers.upsertUserAddress)

router.get('/listings/:user_id', userControllers.getUserListings)

router.get('/my-listings', verifyAuthentication, userControllers.getMyListings)

// router.put('/upload/image', verifyAuthentication, upload.single('image'), userControllers.updateUserImage)

export default router