
// --------------------------Importing In-Built Modules------------------
// import fs from 'fs';
// --------------------------Importing Third-Party Modules------------------
import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit'

// --------------------------Importing Custom Modules--------------
import connectDB from './Database/connectDB.js';
import LoginAuth from './Routes/RouteAuthLogin.js'
import newRegister from './Routes/RouteRegister.js'
import refferal from './Routes/RouteRefferal.js'
import location from './Routes/RouteLocation.js'
import Authenticate from './Controllers/LoginValidation.js';
import Feature from './Controllers/Features.js'

// -------------------------------connecting to database-------------------------

const DatabaseURL = process.env.DATABASE_URL;
connectDB(DatabaseURL);

// -------------------------------Creating Routes Security & Settings-------------------------

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.set('views', './Views')
app.set('view engine', 'ejs');

const whitelist = [process.env.whitelist_URL];
const corsOptions = {
    // origin: function (origin, callback) {
    //     if (whitelist.indexOf(origin) !== -1 && origin) {
    //         callback(null, true)
    //     } else {
    //         callback('You Dont Have Enough Permission to Access !!')
    //         // callback(null, true)

    //     }
    // },

    origin: process.env.whitelist_URL,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",

}

const createAccountLimiter = rateLimit({

    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // Limit each IP to 5 create account requests per `window` (here, per hour)
    message: {
        msg: 'Too Many Request, Try Again Later',
        error: 'out of limit',
        validation: false,
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (request, response, next, options) =>
        response.clearCookie('accesstoken', {
            domain: process.env.COOKIE_DOMAIN,
            httpOnly: true,
            path: '/',
            secure: true,
            // signed: true,
            sameSite: 'strict'
        }).status(options.statusCode).send(options.message),

})

const ratelimitforforgetpass = rateLimit({
    windowMs: 60 * 15 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
    message: {
        msg: 'Too Many Request, Try Again Later',
        error: 'out of limit',
        validation: false,
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers

})


const forgetpasscors = {
    origin: process.env.INDEX_URL,
    optionsSuccessStatus: 200
}
app.get('/:refferalid([0-9]{5})/:token', ratelimitforforgetpass, Feature.resetlinkaccess)
app.post('/:refferalid([0-9]{5})/:token', cors(forgetpasscors), ratelimitforforgetpass, Feature.setnewpassword)



app.use(cors(corsOptions));
app.use(createAccountLimiter)
app.set('trust proxy', 1)



// -------------------------------Creating Routes --------------------------------------


// let time = 0;
// app.all('*', async (req, res, next) => {
//     time += 1
//     console.log(time)
//     next()
// })

app.use('/api/login', LoginAuth)

app.use('/api/new', newRegister)

app.use('/api/refferal', refferal)

app.use('/api/location', location)

app.use('/profile', LoginAuth)

app.get('/working', (req, res) => {
    res.send({ status: true })
})

app.all('*', (req, res) => {
    res.status(200).json({ message: 'You Dont Have Enough Permission to Access :)' })
})
// -------------------------------Running on PORT -------------------------

// const PORT = process.env.PORT;
// app.listen(PORT, () => {
//     console.log(`listening on port http://localhost:${PORT}`)
// });

export default app;




