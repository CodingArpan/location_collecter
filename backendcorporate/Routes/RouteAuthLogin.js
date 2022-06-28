import express from 'express';
import { body } from 'express-validator';
import Authenticate from '../Controllers/LoginValidation.js';
import Errorvalidation from '../Middlewares/Errorhandeler.js'
import Feature from '../Controllers/Features.js'

const router = express.Router();

const verifyTxtData = [

    body('userid').isLength({ min: 5, max: 100 }).custom((value) => {
        const validEmail = new RegExp('(^[a-zA-Z0-9._-]{0,100})(@[a-zA-Z0-9\-]{3,63})(.[a-zA-Z.-]{2,63})').test(value);
        const validMobile = new RegExp('^[0-9]{10}$').test(value);
        if (validEmail || validMobile) {
            // // console.log(value, validEmail, validMobile)
            return true;
        } else {
            throw new Error('Your Input Not Looks Like An Email / Mobile Number, Please Check Again')
        }
    }).withMessage('Your Input Not Looks Like An Email / Mobile Number, Please Check Again'),

    body('userpwd').isLength({ min: 5, max: 20 }).withMessage('Please Enter Valid Password').matches('^[a-zA-Z0-9#%\+_-]+$').withMessage('Please Enter Valid Password'),

    body('usertype').isIn(['corporate', 'representative', 'regional_manager', 'manager']).withMessage('Please Select Given Values only'),

]

router.post('/auth', verifyTxtData, Errorvalidation.checkError, Authenticate.byUserCredentials);

router.post('/forget',
    [body('emailmob').isLength({ min: 5, max: 100 }).custom((value) => {
        const validEmail = new RegExp('(^[a-zA-Z0-9._-]{0,100})(@[a-zA-Z0-9\-]{3,63})(.[a-zA-Z.-]{2,63})').test(value);
        const validMobile = new RegExp('^[0-9]{10}$').test(value);
        if (validEmail || validMobile) {
            // // console.log(value, validEmail, validMobile)
            return true;
        } else {
            throw new Error('Your Input Not Looks Like An Email / Mobile Number, Please Check Again')
        }
    }).withMessage('Your Input Not Looks Like An Email / Mobile Number, Please Check Again'), body('refferalid').isLength({ min: 5, max: 5 }).withMessage('Refferal ID Must Be 5 Characters Long').matches('^[0-9]{5}$').withMessage('Refferal ID Must Be Contain Only Numbers')], Errorvalidation.checkError, Feature.resetpassword);

router.post('/verification', Errorvalidation.bodyData, Authenticate.byAccessToken);

router.post('/logout', Errorvalidation.bodyData, Authenticate.logout);

router.post('/myprofile', Authenticate.myprofile);

router.post('/allname', Authenticate.allnames);

router.post('/thisemployee', [
    body('refferalid').isLength({ min: 5, max: 5 }).withMessage('Refferal ID Must Be 5 Characters Long').matches('^[0-9]{5}$').withMessage('Refferal ID Must Be Contain Only Numbers'),body('name').isLength({ min: 5, max: 100 }).withMessage('Name Must Be 5 to 100 Characters Long').matches('^[a-zA-Z ]+$').withMessage('Name Must Be Contain Only Alphabets'),
], Errorvalidation.checkError , Authenticate.thisemployee);



export default router;
