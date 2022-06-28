import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import Protection from "../Middlewares/Protection.js";
import registrationmodel from '../Models/NewProfilemodel.js';
import RefferalModel from "../Models/NewRefferals.js";
import dotenv from 'dotenv';
dotenv.config()

const TokenSignForRegister = process.env.REGISTER_TOKEN_SIGN;


class Registration {

    static createProfile = async (req, res, next) => {
        try {

            for (const key in req.body) {
                req.body[key] = req.body[key].replace(/\s+/g, ' ').trim();
            }

            // // console.log(req.body)

            let { refferalid, fullname, email, mobile, position, newpwd, confirmpwd } = req.body;
            const currentpic = req.files.currentpic[0].buffer.toString('base64');
            const userRegJWT = req.headers.cookie !== undefined ? req.headers.cookie.split(';').find((cki) => { return cki.includes('registrationtoken') }).split('=')[1] : '';
            // console.log(userRegJWT)

            jwt.verify(userRegJWT, TokenSignForRegister, async (err, decoded) => {

                if (err) {

                    res.clearCookie('registrationtoken', {
                        domain: process.env.COOKIE_DOMAIN,
                        httpOnly: true,
                        path: '/',
                        secure: true,
                        // signed: true,
                        sameSite: 'strict'
                    });

                    res.status(500).json({
                        name: 'User',
                        msg4user: 'Your Refferal Id is Not Valid Or Expired'
                    })


                } else {
                    // console.log(decoded)
                    if (newpwd === confirmpwd && decoded.id === refferalid && (decoded.name === fullname || decoded.email === email) && decoded.position === position) {
                        const salt = bcrypt.genSaltSync(10);
                        const password = Protection.addMasalaTo(confirmpwd);
                        const hash = bcrypt.hashSync(password, salt);
                        confirmpwd = hash;

                        registrationmodel.create({
                            refferalid, fullname, email, mobile, position, confirmpwd, currentpic, refferedby: decoded.issuer
                        }).then(async (savedData) => {

                            const deleted = await RefferalModel.updateOne({ recipentrefferalid: refferalid }, { status: true })

                            // console.log('updated')

                            res.clearCookie('registrationtoken', {
                                domain: process.env.COOKIE_DOMAIN,
                                httpOnly: true,
                                path: '/',
                                secure: true,
                                // signed: true,
                                sameSite: 'strict'
                            });

                            res.status(200).json({
                                name: savedData.fullname,
                                msg4user: 'Profile Creation Successfull !'
                            });

                            // console.log('savedData----------------------------');

                        }).catch((error) => {

                            res.clearCookie('registrationtoken', {
                                domain: process.env.COOKIE_DOMAIN,
                                httpOnly: true,
                                path: '/',
                                secure: true,
                                // signed: true,
                                sameSite: 'strict'
                            });
                            res.status(500).json({
                                name: User,
                                msg4user: 'Internal Server Error, Please Try Again Later'
                            })

                            // console.log(error.message);

                        })

                    } else {
                        res.clearCookie('registrationtoken', {
                            domain: process.env.COOKIE_DOMAIN,
                            httpOnly: true,
                            path: '/',
                            secure: true,
                            // signed: true,
                            sameSite: 'strict'
                        });

                        res.status(500).json({
                            name: User,
                            msg4user: 'Your Refferal Id is Not Valid Or Expired'
                        })
                    }
                }

            });


        } catch (error) {

            console.log(error.message)

            res.clearCookie('registrationtoken', {
                domain: process.env.COOKIE_DOMAIN,
                httpOnly: true,
                path: '/',
                secure: true,
                // signed: true,
                sameSite: 'strict'
            });

            res.status(500).json({
                name: 'User',
                msg4user: 'Internal Server Error, Please Try Again Later'
            })
        }
    }

    static validateRefferalID = async (req, res, next) => {
        // // console.log(req.body);

        try {

            const findrefferal = await RefferalModel.find({ recipentrefferalid: req.body.refferalid })
            // console.log(findrefferal)
            if (findrefferal.length === 1 && (!findrefferal[0].status)) {

                // // console.log(findrefferal)

                const regToken = jwt.sign({

                    id: req.body.refferalid,
                    issuer: findrefferal[0].issuerid,
                    name: findrefferal[0].recipentname,
                    email: findrefferal[0].recipentemail,
                    position: findrefferal[0].recipenttype


                }, TokenSignForRegister, { expiresIn: 60 * 60 });


                res.cookie('registrationtoken', regToken, {
                    domain: process.env.COOKIE_DOMAIN,
                    httpOnly: true,
                    path: '/',
                    secure: true,
                    // signed: true,
                    sameSite: 'strict'
                });

                res.status(200).json({
                    id: req.body.refferalid,
                    data: {
                        name: findrefferal[0].recipentname,
                        email: findrefferal[0].recipentemail,
                        position: findrefferal[0].recipenttype
                    },
                    validation: true,
                    msg: `${req.body.refferalid} Refferal ID Is Valid`,

                })






            } else {
                res.status(200).json({
                    id: req.body.refferalid,
                    validation: false,
                    msg: ` ${req.body.refferalid} Refferal ID Is Invalid Or Expired`,

                })
            }

        } catch (error) {

            console.log(error.message)

            res.status(500).json({
                validation: false,
                id: req.body.refferalid,
                msg: ` Refferal ID Validation Failed`
            })

        }

    }

}


export default Registration;