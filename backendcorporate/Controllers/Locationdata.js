import Protection from "../Middlewares/Protection.js";
import DailyLocationmodel from '../Models/Locationmodel.js'
import registrationmodel from '../Models/NewProfilemodel.js';


class Location {

    static storeLocation = async (req, res, next) => {
        try {
            const { latitude, longitude, locationaccuracy, purpose, message } = req.body;
            const verification = Protection.byToken(req.headers.cookie)
            const user = Protection.byuser(req.headers.cookie)
            const userdata = await registrationmodel.find({ refferalid: verification.data.userid }).select('fullname position')
            // console.log(verification)
            // console.log(userdata)

            if (verification.data.name === 'glacier pharma' && verification.data.type[0] === 'master' && verification.data.userid === '99999') {
                verification.data.type[0] = userdata[0].position;
            }

            if (verification.status && user.status && userdata.length === 1 && user.data.id === verification.data.userid && verification.data.name === userdata[0].fullname && userdata[0].position === verification.data.type[0]) {

                const savelocation = await DailyLocationmodel.create({
                    latitude,
                    longitude,
                    locationaccuracy,
                    purpose,
                    message,
                    userid: verification.data.userid,
                    name: userdata[0].fullname,
                    position: userdata[0].position
                })

                // console.log(savelocation)

                res.status(200).json({
                    status: true, message: `Hi ${verification.data.name}, Your Location Submited Successfully`
                })

            } else {
                res.clearCookie('accesstoken', {
                    domain: process.env.COOKIE_DOMAIN,
                    httpOnly: true,
                    path: '/',
                    secure: true,
                    // signed: true,
                    sameSite: 'strict'
                });
                res.status(200).json({ message: 'Please Verify Your Login Credentials', status: false })

            }

        } catch (error) {
            console.log(error.message)
            res.status(500).json({
                message: `Internal Server Error`, status: false
            });
        }

    }

    static getmyLocations = async (req, res, next) => {
        // // console.log(req.params, req.headers.cookie)
        try {

            const { date, month, year } = req.params;
            const reqFulldate = `${date}/${month}/${year}`
            const verification = Protection.byToken(req.headers.cookie)
            const user = Protection.byuser(req.headers.cookie)
            const userdata = await registrationmodel.find({ refferalid: verification.data.userid }).select('fullname position')

            if (verification.data.name === 'glacier pharma' && verification.data.type[0] === 'master' && verification.data.userid === '99999') {
                verification.data.type[0] = userdata[0].position;
            }

            if (verification.status && user.status && userdata.length === 1 && user.data.id === verification.data.userid && verification.data.name === userdata[0].fullname && userdata[0].position === verification.data.type[0]) {

                const allreqloc = await DailyLocationmodel.find({ userid: verification.data.userid, date: reqFulldate }).select('-locationaccuracy -userid -name -position -__v')

                // // console.log(allreqloc)

                res.status(200).json({ status: true, data: allreqloc })

            } else {
                res.clearCookie('accesstoken', {
                    domain: process.env.COOKIE_DOMAIN,
                    httpOnly: true,
                    path: '/',
                    secure: true,
                    // signed: true,
                    sameSite: 'strict'
                });
                res.status(200).json({ message: 'Please Verify Your Login Credentials', status: false })
            }

        } catch (error) {
            console.log(error.message)
            res.clearCookie('accesstoken', {
                domain: process.env.COOKIE_DOMAIN,
                httpOnly: true,
                path: '/',
                secure: true,
                // signed: true,
                sameSite: 'strict'
            });
            res.status(200).json({ message: 'Please Verify Your Login Credentials', status: false })
        }
    }

    static getallLocations = async (req, res, next) => {

        try {


            const { date, month, year } = req.params;
            const reqFulldate = `${date}/${month}/${year}`
            const verification = Protection.byToken(req.headers.cookie)
            const user = Protection.byuser(req.headers.cookie)
            const userdata = await registrationmodel.find({ refferalid: verification.data.userid }).select('fullname position')

            // // console.log(verification)

            if (verification.data.name === 'glacier pharma' && verification.data.type[0] === 'master' && verification.data.userid === '99999') {
                verification.data.type[0] = userdata[0].position;
            }


            if (verification.status && user.status && userdata.length === 1 && user.data.id === verification.data.userid && verification.data.name === userdata[0].fullname && userdata[0].position === verification.data.type[0]) {

                const alllocdata = await DailyLocationmodel.find({ date: reqFulldate }).select('-userid -__v')

                // // console.log(alllocdata)

                res.status(200).json({ status: true, data: alllocdata })

            } else {

                res.clearCookie('accesstoken', {
                    domain: process.env.COOKIE_DOMAIN,
                    httpOnly: true,
                    path: '/',
                    secure: true,
                    // signed: true,
                    sameSite: 'strict'
                });
                res.status(200).json({ message: 'Please Verify Your Login Credentials', status: false })
            }
        } catch (error) {
            console.log(error.message)

            res.clearCookie('accesstoken', {
                domain: process.env.COOKIE_DOMAIN,
                httpOnly: true,
                path: '/',
                secure: true,
                // signed: true,
                sameSite: 'strict'
            });
            res.status(200).json({ message: 'Please Verify Your Login Credentials', status: false })
        }
    }

    static verifylocation = async (req, res, next) => {

        try {
            const { locid, verifier } = req.params;

            const verification = Protection.byToken(req.headers.cookie)
            const user = Protection.byuser(req.headers.cookie)
            const userdata = await registrationmodel.find({ refferalid: verification.data.userid }).select('fullname position')

            if (verification.data.name === 'glacier pharma' && verification.data.type[0] === 'master' && verification.data.userid === '99999') {
                verification.data.type[0] = userdata[0].position;
            }


            if (verification.status && user.status && userdata.length === 1 && user.data.id === verification.data.userid && verification.data.name === userdata[0].fullname && userdata[0].position === 'corporate' && verification.data.type[0] === 'corporate') {

                const verifyloc = await DailyLocationmodel.updateOne({ _id: locid }, { $addToSet: { verifyby: `${userdata[0].fullname}+${verification.data.userid}`, } })

                // console.log(verifyloc)

                if (verifyloc.acknowledged && verifyloc.modifiedCount === 1) {
                    res.status(200).json({ status: true, message: `This Location Successfully Verified By You`, data: verifyloc })

                } else if ((verifyloc.acknowledged && verifyloc.modifiedCount === 0)) {
                    res.status(200).json({ status: false, message: `This Location Already Verified By You !`, data: verifyloc })
                } else {
                    res.status(200).json({ status: false, message: `Location Verification Failed` })
                }








            } else {

                res.clearCookie('accesstoken', {
                    domain: process.env.COOKIE_DOMAIN,
                    httpOnly: true,
                    path: '/',
                    secure: true,
                    // signed: true,
                    sameSite: 'strict'
                });
                res.status(200).json({ message: 'Please Verify Your Login Credentials', status: false })
            }







        } catch (error) {
            console.log(error.message)

            res.clearCookie('accesstoken', {
                domain: process.env.COOKIE_DOMAIN,
                httpOnly: true,
                path: '/',
                secure: true,
                // signed: true,
                sameSite: 'strict'
            });
            res.status(200).json({ message: 'Please Verify Your Login Credentials', status: false })
        }

    }

    static alllocationreport = async (req, res, next) => {
        console.log(req.body)
    

        try {

            const { startdate, enddate } = req.body;

            const verification = Protection.byToken(req.headers.cookie)
            const user = Protection.byuser(req.headers.cookie)
            const userdata = await registrationmodel.find({ refferalid: verification.data.userid }).select('fullname position')

            // // console.log(verification)

            if (verification.data.name === 'glacier pharma' && verification.data.type[0] === 'master' && verification.data.userid === '99999') {
                verification.data.type[0] = userdata[0].position;
            }

            if (verification.status && user.status && userdata.length === 1 && user.data.id === verification.data.userid && verification.data.name === userdata[0].fullname && userdata[0].position === verification.data.type[0]) {


                const form = new Date(startdate);
                const to = new Date(enddate);

                console.log(form, to)

                const unstructuredreport = await DailyLocationmodel.find({ createdAt: { $gte: form, $lte: to } }).select('-_id -position -createdAt -updatedAt -__v')

                console.log(unstructuredreport)

                // setTimeout(() => {
                res.status(200).json({ message: 'Getting data Successfull', status: true, data: unstructuredreport })

                // }, 5000);





















            } else {

                res.clearCookie('accesstoken', {
                    domain: process.env.COOKIE_DOMAIN,
                    httpOnly: true,
                    path: '/',
                    secure: true,
                    // signed: true,
                    sameSite: 'strict'
                });
                res.status(200).json({ message: 'Please Verify Your Login Credentials', status: false })
            }

        } catch (error) {
            console.log(error.message)


            res.status(200).json({ message: 'Internal Server Error', status: false })
        }

    }





}

export default Location

