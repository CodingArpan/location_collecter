import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import Protection from "../Middlewares/Protection.js";
import registrationmodel from '../Models/NewProfilemodel.js';
import RefferalModel from "../Models/NewRefferals.js";
import Mail from '../Middlewares/Sendmail.js'

class Refferal {

    static createnew = async (req, res, next) => {
        try {

            const { creatorpwd, recipentname, recipentemail, recipenttype } = req.body;

            const verification = Protection.byToken(req.headers.cookie)
            // // console.log(verification)
            if (verification.status) {
                const userData = verification.data;
                const validuser = await registrationmodel.find({ refferalid: userData.userid }).select('fullname position confirmpwd');
                // // console.log(validuser);

                const password = Protection.addMasalaTo(creatorpwd);
                const passAuth = bcrypt.compareSync(password, validuser[0].confirmpwd);

                // console.log(passAuth);



                if (userData.name === 'glacier pharma' && userData.type[0] === 'master' && userData.userid === '99999') {
                    userData.type[0] = validuser[0].position;
                }


                if (validuser.length === 1 && validuser[0].fullname === userData.name && passAuth && userData.type.length === 1 && validuser[0].position === userData.type[0]) {

                    const createref = async (userid, recipentname, recipentemail, recipenttype) => {
                        try {


                            let creation = true;
                            let newrefferal;

                            while (creation || newrefferal == '99999') {
                                // // console.log(creation, newrefferal == '99999')
                                newrefferal = (parseInt(Math.random() * 100000)).toString();
                                const data = await RefferalModel.find({ $or: [{ issuerid: newrefferal }, { recipentrefferalid: newrefferal }] })
                                if (data.length === 0 && newrefferal.length === 5) {
                                    creation = false;
                                }

                            }
                            // console.log(newrefferal)

                            const createdRefferal = await RefferalModel.create({
                                issuerid: userid,
                                recipentname: recipentname,
                                recipentemail: recipentemail,
                                recipenttype: recipenttype,
                                recipentrefferalid: newrefferal,
                                status: false
                            })

                            // console.log(createdRefferal)

                            Mail.sendrefferalid(createdRefferal.recipentemail, createdRefferal.recipentname, createdRefferal.recipentrefferalid, createdRefferal.recipenttype, res)




                            // res.status(200).json({
                            //     message: `Refferal ID for ${createdRefferal.recipentname} is ${createdRefferal.recipentrefferalid} and send to ${createdRefferal.recipentemail}`, status: true
                            // });

                        } catch (error) {
                            // console.log(error.message)
                            res.status(200).json({
                                message: `Refferal ID Creation Failed`, status: false
                            });
                        }
                    }

                    const master = ['corporate', 'representative', 'regional_manager', 'manager'];
                    const corporate = ['representative', 'regional_manager', 'manager'];
                    const manager = ['representative', 'regional_manager'];
                    const regional_manager = ['representative'];
                    const representative = [];

                    if (validuser[0].position === 'corporate' && userData.type[0] === 'corporate' && userData.name === 'glacier pharma' && userData.userid === '99999' && master.includes(recipenttype)) {

                        // console.log('master')
                        createref(userData.userid, recipentname, recipentemail, recipenttype)

                    } else if (validuser[0].position === 'corporate' && corporate.includes(recipenttype)) {
                        // console.log('corporate')
                        createref(userData.userid, recipentname, recipentemail, recipenttype)

                    } else if (validuser[0].position === 'manager' && manager.includes(recipenttype)) {
                        // console.log('manager')
                        createref(userData.userid, recipentname, recipentemail, recipenttype)

                    } else if (validuser[0].position === 'regional_manager' && regional_manager.includes(recipenttype)) {

                        // console.log('regional_manager')
                        createref(userData.userid, recipentname, recipentemail, recipenttype)

                    } else {

                        res.status(200).json({
                            message: `You Do Not Have Enough Permission To Access`, status: false
                        });
                    }

                } else {
                    res.status(200).json({
                        message: `Refferal ID Creation Failed`, status: false
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

        } catch (error) {
            console.log(error.message)
            res.status(500).json({
                message: `Internal Server Error`, status: false
            });
        }

    }

    static sendAll = async (req, res, next) => {

        try {


            const verification = Protection.byToken(req.headers.cookie)
            if (verification.status) {

                const userData = verification.data;
                const validuser = await registrationmodel.findOne({ refferalid: userData.userid }).select('fullname position');
                if (validuser.fullname == 'glacier pharma') {
                    userData.type[0] = 'corporate'
                }

                if (validuser.fullname === userData.name && validuser.position === userData.type[0]) {
                    const allrefferalsunderuser = await RefferalModel.find({ issuerid: userData.userid })
                    // // console.log(allrefferalsunderuser)
                    res.status(200).json({
                        allrefferals: allrefferalsunderuser, status: true
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
        }
    }

    static deletependings = async (req, res, next) => {

        try {


            const verification = Protection.byToken(req.headers.cookie)
            if (verification.status) {

                const userData = verification.data;
                const validuser = await registrationmodel.findOne({ refferalid: userData.userid }).select('fullname position');


                if (validuser.fullname === userData.name && (validuser.position === userData.type[0] || (validuser.position === 'corporate' && userData.type[0] === 'master'))) {

                    const deleted = await RefferalModel.deleteMany({ issuerid: userData.userid, status: false })
                    // // console.log(deleted)
                    res.status(200).json({
                        message: `Total ${deleted.deletedCount} Pending Refferal Id Deleted`, status: true
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
        }
    }
    
}

export default Refferal;

