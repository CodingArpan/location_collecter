import registrationmodel from '../Models/NewProfilemodel.js';
import Protection from "../Middlewares/Protection.js";
import bcrypt from "bcrypt";
import Mail from '../Middlewares/Sendmail.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()
const TokenSignForAccess = process.env.ACCESS_TOKEN_SIGN;
const indexURL = process.env.INDEX_URL;


class Feature {

    static resetpassword = async (req, res, next) => {

        try {
            const { emailmob, refferalid } = req.body;
            const emailregex = new RegExp('(^[a-zA-Z0-9._-]{0,100})(@[a-zA-Z0-9\-]{3,63})(.[a-zA-Z.-]{2,63})');
            const mobileregex = new RegExp('^[0-9]{10}$');
            let validuser = '';
            if (mobileregex.test(emailmob)) {

                validuser = await registrationmodel.find({ mobile: emailmob, refferalid: refferalid }).select('refferalid fullname email')

            } else if (emailregex.test(emailmob)) {

                validuser = await registrationmodel.find({ email: emailmob.toLowerCase(), refferalid: refferalid }).select('refferalid fullname email')

            }

            if (validuser.length === 1) {

                const pwdresetoken = jwt.sign({
                    uniqID: validuser[0]._id,
                    name: validuser[0].fullname
                }, TokenSignForAccess, { expiresIn: '15m' });

                const reseturl = `${indexURL}/${validuser[0].refferalid}/${pwdresetoken}`;

                // console.log(reseturl)

                Mail.sendpwdresetlink(reseturl, validuser[0].email, validuser[0].fullname, validuser[0].refferalid, res)

            } else {
                res.status(200).json({
                    status: false, message: 'Looks Like You Don Not Have Account in Our Company'
                })
            }
        } catch (error) {
            console.log(error.message)
            res.status(500).json({
                status: false, message: 'Internal Server Error,Please Try Again Later'
            })
        }



    }

    static resetlinkaccess = async (req, res, next) => {
        try {

            const regex = new RegExp('[\w\.\-]+');
            if (regex.test(req.params.token)) {
                try {
                    const { refferalid, token } = req.params;

                    const user = await registrationmodel.find({ refferalid: refferalid }).select('refferalid fullname email mobile')

                    if (user.length === 1) {
                        jwt.verify(token, TokenSignForAccess, async (err, decoded) => {
                            if (err) {
                                res.render('Error')
                                console.log(err.message)
                            } else {
                                // console.log(decoded)
                                const validuser = await registrationmodel.find({ _id: decoded.uniqID }).select('refferalid fullname email mobile');

                                if (user[0]._id.toString() === validuser[0]._id.toString() && user[0].refferalid === validuser[0].refferalid && user[0].fullname === validuser[0].fullname && user[0].email === validuser[0].email && user[0].mobile === validuser[0].mobile) {

                                    res.render('Resetpwd', { 'name': validuser[0].fullname, url: req.url, msg: '' })

                                } else {

                                    res.render('Error')

                                }

                            }
                        });

                    } else {
                        res.render('Error')

                    }

                } catch (error) {

                    res.render('Error')


                }
            } else {
                res.render('Error')
            }
        } catch (error) {
            res.render('Error')
            console.log(error.message)

        }
    }

    static setnewpassword = async (req, res, next) => {
        try {
            const regex = new RegExp('[\w\.\-]+');
            if (regex.test(req.params.token)) {
                const jwtvalue = jwt.decode(req.params.token)
                // console.log(jwtvalue)
                const { refferalid, token } = req.params
                const { newpass, cnfpass } = req.body;
                const pwdrgx = new RegExp('^[a-zA-Z0-9#%\+_-]+$')

                if (newpass === cnfpass && cnfpass.length <= 20 && cnfpass.length >= 3 && pwdrgx.test(cnfpass)) {

                    const user = await registrationmodel.find({ refferalid: refferalid }).select('refferalid fullname email mobile')

                    if (user.length === 1) {
                        jwt.verify(token, TokenSignForAccess, async (err, decoded) => {
                            if (err) {
                                res.render('Error')
                                // console.log(err.message)
                            } else {
                                // console.log(decoded)
                                const validuser = await registrationmodel.find({ _id: decoded.uniqID }).select('refferalid fullname email mobile');

                                if (user[0]._id.toString() === validuser[0]._id.toString() && user[0].refferalid === validuser[0].refferalid && user[0].fullname === validuser[0].fullname && user[0].email === validuser[0].email && user[0].mobile === validuser[0].mobile) {

                                    const salt = bcrypt.genSaltSync(10);
                                    const password = Protection.addMasalaTo(cnfpass);
                                    const hash = bcrypt.hashSync(password, salt);



                                    const update = await registrationmodel.updateOne({ _id: decoded.uniqID }, { confirmpwd: hash })
                                    // console.log(update)
                                    if (update.acknowledged && update.modifiedCount === 1) {
                                        res.render('success')
                                    } else {
                                        res.render('Error')
                                    }




                                } else {

                                    res.render('Error')

                                }

                            }
                        });

                    } else {
                        res.render('Error')

                    }

                } else {
                    res.render('Resetpwd', {
                        'name': jwtvalue.name.split(' ')[0],
                        url: req.url,
                        msg: 'New Password & Confirm Password must be same and 3 to 20 characters long and only a-z A-Z 0-9 # % + _ - are allowed'

                    })
                }



            } else {
                res.render('Error')
            }

        } catch (error) {
            res.render('Error')
            console.log(error.message)


        }
    }



}

export default Feature