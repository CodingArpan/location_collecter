import express from 'express';
import { body } from 'express-validator';
import Errorvalidation from '../Middlewares/Errorhandeler.js';
import Location from '../Controllers/Locationdata.js'
const router = express.Router();


const dataverification = [

    body('latitude').isLength({ max: 15 }).withMessage('Not A Valid Latitude').matches('^[0-9\.]+$').withMessage('Not A Valid Latitude'),

    body('longitude').isLength({ max: 15 }).withMessage('Not A Valid Longitude').matches('^[0-9\.]+$').withMessage('Not A Valid Longitude'),

    body('locationaccuracy').isLength({ max: 30 }).withMessage('Not A Valid location Accuracy').matches('^[0-9\.]+$').withMessage('Not A Valid location Accuracy'),

    body('purpose').isLength({ min: 5, max: 200 }).withMessage('Not A Valid Purpose').matches('^[a-zA-Z0-9\.\,\\ ]+$').withMessage('Not A Valid Purpose'),

    body('message').isLength({ min: 5, max: 500 }).withMessage('Not A Valid Purpose').matches('^[a-zA-Z0-9\.\,\\ ]+$').withMessage('Not A Valid Purpose'),

]

router.post('/submit', dataverification, Errorvalidation.checkError, Location.storeLocation)
router.get('/myloc/:date([0-9]{1,2})/:month([0-9]{1,2})/:year([0-9]{4})',  Location.getmyLocations)
router.get('/allloc/:date([0-9]{1,2})/:month([0-9]{1,2})/:year([0-9]{4})',Location.getallLocations)
router.get('/verify/:locid([0-9a-z]{12,24})/:verifier([0-9]{5})',Location.verifylocation)
router.post('/getreport',Location.alllocationreport)

export default router;


