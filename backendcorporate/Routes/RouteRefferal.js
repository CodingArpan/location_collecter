import express from 'express';
import { body } from 'express-validator';
import Errorvalidation from '../Middlewares/Errorhandeler.js';
import Refferal from '../Controllers/Newrefferal.js'


const router = express.Router();
const dataVerification = [

    body('recipentname').isLength({ min: 5, max: 100 }).withMessage('Name Must Be 5 to 100 Characters Long').matches('^[a-zA-Z ]+$').withMessage('Name Must Be Contain Only Alphabets'),

    body('recipentemail').isLength({ min: 5, max: 100 }).withMessage('Email Must Be 5 to 100 Characters Long').isEmail().normalizeEmail().withMessage('Your Input Not Looks Like An Email, Please Check Again'),

    body('recipenttype').isIn(['corporate', 'representative', 'regional_manager', 'manager']).withMessage('Please Select Given Values only'),

    body('creatorpwd').isLength({ min: 3, max: 20 }).withMessage('Password Must Be 3 to 20 Characters Long').matches('^[a-zA-Z0-9#%\+_-]+$').withMessage('Password Must Be Contain Only a-z, A-Z, 0-9,#,%,+,_,-'),

];

router.post('/createnew', dataVerification, Errorvalidation.checkError, Refferal.createnew)

router.post('/all', Errorvalidation.bodyData, Refferal.sendAll)

router.post('/deletpendings', Errorvalidation.bodyData, Refferal.deletependings)


export default router;