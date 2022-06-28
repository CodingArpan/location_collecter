import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()
const TokenSignForAccess = process.env.ACCESS_TOKEN_SIGN;
const TokenSignForUser = process.env.USER_TOKEN_SIGN;

class Protection {

    static addMasalaTo = (msPWD) => {

        const masalaPass = msPWD.replace(/0/g, ')@').replace(/1/g, '!Yz').replace(/2/g, '@vWx').replace(/3/g, '#sTu').replace(/4/g, '$pQr').replace(/5/g, '%mNo').replace(/6/g, '^jKl').replace(/7/g, '&gHi').replace(/\*8/g, 'dEf').replace(/9/g, '(aBc').replace(/\+/g, '/.GP/').replace(/\%/g, '<=>').concat('101')
        // // console.log(masalaPass)
        return masalaPass;

        // 0 --> @
        // 1 --> Yz
        // 2 --> vWx
        // 3 --> sTu
        // 4 --> pQr
        // 5 --> mNo
        // 6 --> jKl
        // 7 --> gHi
        // 8 --> dEf
        // 9 --> aBc
        // + --> /.GP/
        // % --> <=>
    }

    static byToken = (cookie) => {
        // // console.log(cookie)

        try {


            if (cookie !== ('undefined' || '' || 'null')) {
                const userJWT = cookie.split(';').find((coki) => {
                    return coki.includes('accesstoken')
                }).split('=')[1];
                if (userJWT !== ('undefined' || '' || 'null')) {
                    try {
                        const result = jwt.verify(userJWT, TokenSignForAccess);
                        const userBuffer = Buffer.from(result.uniqID, "base64");
                        const userData = JSON.parse(userBuffer.toString('utf8'));
                        return { status: true, data: userData }
                    } catch (err) {
                        return { status: false, error: err.message }

                    }
                } else {
                    return { status: false, error: err.message }
                }
            } else {
                return { status: false, error: err.message }
            }

        } catch (err) {
            console.log(err.message)
            return { status: false, error: err.message }

        }

    }

    static byuser = (cookie) => {
        // // console.log(cookie)

        try {


            if (cookie !== ('undefined' || '' || 'null')) {
                const userJWT = cookie.split(';').find((coki) => {
                    return coki.includes('usertoken')
                }).split('=')[1];
                if (userJWT !== ('undefined' || '' || 'null')) {
                    try {
                        const result = jwt.verify(userJWT, TokenSignForUser);

                        return { status: true, data: result }
                    } catch (err) {
                        return { status: false, error: err.message }

                    }
                } else {
                    return { status: false, error: err.message }
                }
            } else {
                return { status: false, error: err.message }
            }

        } catch (err) {
            console.log(err.message)

            return { status: false, error: err.message }
        }

    }



}


export default Protection;

