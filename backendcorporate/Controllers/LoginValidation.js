import registrationmodel from '../Models/NewProfilemodel.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()
import Protection from "../Middlewares/Protection.js";
const TokenSignForAccess = process.env.ACCESS_TOKEN_SIGN;
const TokenSignForUser = process.env.USER_TOKEN_SIGN;
const masterID = process.env.MASTER_ID;


class Authenticate {

    static byUserCredentials = async (req, res, next) => {
        const { userid, userpwd, usertype } = req.body;
        // console.log(TokenSignForAccess, TokenSignForUser, masterID);

        try {

            let thisuser = '';
            const emailregex = new RegExp('(^[a-zA-Z0-9._-]{0,100})(@[a-zA-Z0-9\-]{3,63})(.[a-zA-Z.-]{2,63})');
            const mobileregex = new RegExp('^[0-9]{10}$');

            if (mobileregex.test(userid)) {

                thisuser = await registrationmodel.findOne({ mobile: userid }).select('refferalid fullname  position confirmpwd')

            } else if (emailregex.test(userid)) {
                thisuser = await registrationmodel.findOne({ email: userid.toLowerCase() }).select('refferalid fullname  position confirmpwd')
            }
            // console.log(thisuser, '-----------------')

            if (thisuser) {

                const password = Protection.addMasalaTo(userpwd);
                const passAuth = bcrypt.compareSync(password, thisuser.confirmpwd);
                const typeauth = (usertype === thisuser.position) ? true : false;

                // console.log(userid.toLowerCase())
                // console.log(masterID)

                if (userid.toLowerCase() === masterID.toLowerCase()) {
                    thisuser.position = 'master';
                }

                if (typeauth && passAuth) {

                    const data = {

                        userid: thisuser.refferalid,
                        type: [thisuser.position],
                        name: thisuser.fullname

                    }

                    const buffer = Buffer.from(JSON.stringify(data), "utf8");
                    const Vbase64 = buffer.toString('base64');

                    // const buffer2 = Buffer.from(Vbase64, "base64");
                    // const real = JSON.parse(buffer2.toString('utf8'));

                    // // console.log(buffer, buffer2)
                    // // console.log(Vbase64)
                    // // console.log(real)

                    const msToken = jwt.sign({

                        uniqID: Vbase64

                    }, TokenSignForAccess, { expiresIn: 60 * 60 * 24 });

                    res.cookie('accesstoken', msToken, {
                        domain: process.env.COOKIE_DOMAIN,
                        maxAge: 24 * 60 * 60 * 1000,
                        httpOnly: true,
                        path: '/',
                        sameSite: 'strict',
                        secure: true,
                        // signed: true,
                    });

                    res.status(200).json({ status: true, accesstype: 'login' });

                } else {
                    res.status(404).send({ status: false, accesstype: 'login', message: 'You Do Not Have Enough Permission To Access, Login Failed' })
                }


            } else {

                res.status(404).send({ status: false, accesstype: 'login', message: 'You Do Not Have Enough Permission To Access, Login Failed' })
            }



        } catch (error) {
            console.log(error.message)

            res.status(404).send({ status: false, accesstype: 'login', message: 'Internal Server Error, please try again later' })
        }

        // res.send(req.body)
    }

    static byAccessToken = async (req, res, next) => {

        // console.log(req)

        try {
            const verification = Protection.byToken(req.headers.cookie)
            // console.log(verification)
            if (verification.status) {
                const userData = verification.data;
                const validuser = await registrationmodel.findOne({ refferalid: userData.userid }).select('fullname position');
                // console.log(validuser)

                if (validuser && validuser.fullname === userData.name && userData.type.length === 1 && (validuser.position === userData.type[0] || (validuser.position === 'corporate' && userData.type[0] === 'master'))) {


                    const UserToken = jwt.sign({
                        type: userData.type[0],
                        name: validuser.fullname,
                        id: userData.userid
                    }, TokenSignForUser, { expiresIn: 60 * 60 * 24 });

                    res.cookie('usertoken', UserToken, {
                        domain: process.env.COOKIE_DOMAIN,
                        maxAge: 24 * 60 * 60 * 1000,
                        // httpOnly: true,
                        path: '/',
                        sameSite: 'strict',
                        secure: true,
                        // signed: true,
                    });


                    if (userData.type.includes('master')) {
                        // console.log('master')
                        res.status(200).json({
                            message: 'User Authenticated', status: true, redirect: 'm8st6r',

                        });



                    } else if (userData.type.includes('corporate')) {
                        // console.log('corporate')
                        res.status(200).json({
                            message: 'User Authenticated', status: true, redirect: `admin`
                        });

                    } else if (userData.type.includes('regional_manager')) {
                        // console.log('regional_manager')

                        res.status(200).json({
                            message: 'User Authenticated', status: true, redirect: `regionalmanager`
                        });
                    } else if (userData.type.includes('manager')) {
                        // console.log('manager')
                        res.status(200).json({
                            message: 'User Authenticated', status: true, redirect: `manager`
                        });

                    } else if (userData.type.includes('representative')) {
                        // console.log('representative')
                        res.status(200).json({
                            message: 'User Authenticated', status: true, redirect: `representative`
                        });

                    } else {
                        res.clearCookie('accesstoken', {
                            domain: process.env.COOKIE_DOMAIN,
                            httpOnly: true,
                            path: '/',
                            secure: true,
                            // signed: true,
                            sameSite: 'strict'
                        });
                        res.status(500).json({
                            message: 'Please Verify Your Login Credentials,Login Failed ', status: false
                        });
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
            res.status(200).json({ message: 'Internal Server Error, Please Try Again Later', status: false })

        }

    }

    static logout = async (req, res, next) => {

        try {


            res.clearCookie('accesstoken', {
                domain: process.env.COOKIE_DOMAIN,
                httpOnly: true,
                path: '/',
                secure: true,
                // signed: true,
                sameSite: 'strict'
            });
            res.clearCookie('usertoken', {
                domain: process.env.COOKIE_DOMAIN,
                // httpOnly: true,
                path: '/',
                secure: true,
                // signed: true,
                sameSite: 'strict'
            });
            res.status(200).json({ message: 'Please Verify Your Login Credentials', status: false })

        } catch (error) {
            console.log(error.message)
        }
    }

    static myprofile = async (req, res, next) => {
        try {


            const verification = Protection.byToken(req.headers.cookie)
            const user = Protection.byuser(req.headers.cookie)
            const userdata = await registrationmodel.find({ refferalid: verification.data.userid }).select('fullname position refferalid email mobile currentpic -_id')

            if (verification.data.name === 'glacier pharma' && verification.data.type[0] === 'master' && verification.data.userid === '99999') {
                verification.data.type[0] = userdata[0].position;
            }
            // // console.log(verification)
            // // console.log(user)
            // // console.log(userdata)

            if (verification.status && user.status && userdata.length === 1 && user.data.id === verification.data.userid && verification.data.name === userdata[0].fullname && userdata[0].position === verification.data.type[0]) {

                // // console.log(userdata)
                res.status(200).json({ status: true, data: userdata[0] })

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
            res.status(200).json({ message: 'Internal Server Error', status: false })
        }
    }

    static allnames = async (req, res, next) => {

        try {


            const verification = Protection.byToken(req.headers.cookie)
            const user = Protection.byuser(req.headers.cookie)
            const userdata = await registrationmodel.find({ refferalid: verification.data.userid }).select('fullname position refferalid -_id')

            if (verification.data.name === 'glacier pharma' && verification.data.type[0] === 'master' && verification.data.userid === '99999') {
                verification.data.type[0] = userdata[0].position;
            }
            // // console.log(verification)
            // // console.log(user)
            // // console.log(userdata)

            if (verification.status && user.status && userdata.length === 1 && user.data.id === verification.data.userid && verification.data.name === userdata[0].fullname && userdata[0].position === 'corporate' && verification.data.type[0] === 'corporate') {


                const searchdata = await registrationmodel.find({ position: { $ne: "corporate" } }).select('fullname refferalid -_id')

                console.log(searchdata)

                res.status(200).json({ status: true, data: searchdata })




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
            res.status(200).json({ message: 'Internal Server Error', status: false })
        }

    }

    static thisemployee = async (req, res, next) => {
        try {
            console.log(req.body)

            const verification = Protection.byToken(req.headers.cookie)
            const user = Protection.byuser(req.headers.cookie)
            const userdata = await registrationmodel.find({ refferalid: verification.data.userid }).select('fullname position refferalid -_id')

            if (verification.data.name === 'glacier pharma' && verification.data.type[0] === 'master' && verification.data.userid === '99999') {
                verification.data.type[0] = userdata[0].position;
            }
            // // console.log(verification)
            // // console.log(user)
            // // console.log(userdata)

            if (verification.status && user.status && userdata.length === 1 && user.data.id === verification.data.userid && verification.data.name === userdata[0].fullname && userdata[0].position === 'corporate' && verification.data.type[0] === 'corporate') {

                // // console.log(userdata)

                const userdata = await registrationmodel.find({ refferalid: req.body.refferalid }, { fullname: req.body.name }).select('fullname position refferalid email mobile currentpic -_id')



                res.status(200).json({ status: true, message: 'Getting employee data successfull', data: userdata[0] })

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
            res.status(200).json({ message: 'Internal Server Error', status: false })
        }
    }

}

export default Authenticate;


