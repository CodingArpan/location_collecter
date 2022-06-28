import { validationResult } from 'express-validator';

class Errorvalidation {
    static checkError = async (req, res, next) => {
        try {
            const errors = validationResult(req);
            // console.log(errors)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            } else {






                next()
            }
        } catch (error) {
            console.log(error.message);
            res.status(404).send('you do not have enough permission to access this page')
        }
    }

    static bodyData = async (req, res, next) => {
        if (req.body.status === false) {
            next()
        } else {
            res.status(404).send({ message: 'you do not have enough permission to access this page' })
        }
    }


}

export default Errorvalidation;