import express from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import Errorvalidation from '../Middlewares/Errorhandeler.js';
import Registration from '../Controllers/NewRegister.js'

const router = express.Router();

const verifyTxtData = [
    body('refferalid').isLength({ min: 5, max: 5 }).withMessage('Refferal ID Must Be 5 Characters Long').matches('^[0-9]{5}$').withMessage('Refferal ID Must Be Contain Only Numbers'),

    body('fullname').isLength({ min: 5, max: 100 }).withMessage('Name Must Be 5 to 100 Characters Long').matches('^[a-zA-Z ]+$').withMessage('Name Must Be Contain Only Alphabets'),

    body('email').isLength({ min: 5, max: 100 }).withMessage('Email Must Be 5 to 100 Characters Long').isEmail().normalizeEmail().withMessage('Your Input Not Looks Like An Email, Please Check Again'),

    body('mobile').isLength({ min: 10, max: 10 }).withMessage('Mobile Number Must Be 10 Characters Long').matches('^[0-9]{10}$').withMessage('Mobile Number Must Be Contain Only Numbers'),

    body('position').isIn(['corporate', 'representative', 'regional_manager', 'manager']).withMessage('Please Select Given Values only'),

    body('newpwd').isLength({ min: 3, max: 20 }).withMessage('Password Must Be 3 to 20 Characters Long').matches('^[a-zA-Z0-9#%\+_-]+$').withMessage('Password Must Be Contain Only a-z, A-Z, 0-9,#,%,+,_,-'),

    body('confirmpwd').isLength({ min: 3, max: 20 }).withMessage('Password Must Be 3 to 20 Characters Long').matches('^[a-zA-Z0-9#%\+_-]+$').withMessage('Password Must Be Contain Only a-z, A-Z, 0-9,#,%,+,_,-'),


]

const upload = multer({
    // storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg .jpeg format allowed!'));
        }
    },
    limits: { fileSize: 300000 },
})

const getUploads = upload.fields([
    { name: 'currentpic', maxCount: 1 },
])

const getFilesWithErrorHandeling = async (req, res, next) => {

    getUploads(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // console.log('first')
            return res.status(400).json({ errors: err.message });
        } else if (err) {
            // console.log('second')
            return res.status(400).json({ errors: err.message });
        } else {
            // console.log('ok---------------')
            next();
        }
    })
}

router.post('/register', getFilesWithErrorHandeling, verifyTxtData, Errorvalidation.checkError, Registration.createProfile)

router.post('/validate', [body('refferalid').isLength({ min: 5, max: 5 }).withMessage('Refferal ID Must Be 5 Characters Long').matches('^[0-9]{5}$').withMessage('Refferal ID Must Be Contain Only Numbers')], Errorvalidation.checkError, Registration.validateRefferalID)




export default router;