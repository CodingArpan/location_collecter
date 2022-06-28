import nodemailer from 'nodemailer';

class Mail {

    static sendrefferalid = async (recipentemail, name, id, position, res) => {
        const sender = process.env.SENDER_EMAIL;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASS,


            }
        });

        const mailOptions = {
            from: `Glacier Pharma <${sender}>`,
            to: recipentemail,
            subject: 'Refferal ID For Profile Creation',
            html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #338bff;text-decoration:none;font-weight:600">Glacier Pharma</a>
              </div>
              <p style="font-size:1.5em">Hi ${name.toUpperCase()},</p>
              <p>The profile Creation Refferal For You Is <span style="font-size:1.4em;color: #3d6eff;">${id}</span> And You Position Is <span style="font-size:1.4em;color: #3d6eff;">${position.replace('_', ' ')}</span></p>
              <h2 style="background: #338bff;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${id}</h2>
              <p style="font-size:0.9em;">Regards,<br />Glacier Pharma</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>Glacier Pharma</p>
                <p>West Bengal</p>
                <p>India</p>
              </div>
            </div>
          </div>
`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                // console.log(error);
                res.status(200).json({
                    message: `Refferal ID for ${name} is ${id} but cann't send to ${recipentemail}. Please inform the receipent about his refferal ID`, status: true
                });

            } else {
                // console.log(info);
                res.status(200).json({
                    message: `Refferal ID for ${name} is ${id} and send to ${recipentemail}`, status: true
                });
            }
        })




    }

    static sendpwdresetlink = async (url, email, name, id, res) => {
        const sender = process.env.SENDER_EMAIL;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASS,

            }
        });

        const mailOptions = {
            from: `Glacier Pharma <${sender}>`,
            to: email,
            subject: 'Password Reset Link',
            html: `<div class="modal" style=" width: 100%;
            max-width: 500px;
            background: white;
            margin: 20px auto;
            border-radius: 20px;
            padding: 30px 0px;">
                <p class="heading" style="  margin: 20px 0;
                font-size: 1.8rem;
                font-weight: bold;
                color: #506bec;
                letter-spacing:0.5px;
                font-family: 'Rubik', sans-serif;">Forgot your password?</p>
                <p class="para" style="  margin: 20px 0;
      font-size: 1rem;
      font-weight: 200;
      font-family: sans-serif;
      color: #525050;">Hey, we received a request to reset your password.</p>
                <p class="para" style="  margin: 20px 0;
      font-size: 1rem;
      font-weight: 200;
      font-family: sans-serif;
      color: #525050;">Let’s get you a new one!</p>
    
                <a href=${url} target="_blank" style="text-decoration: none;">
                    <div class="button" style="font-family: sans-serif;
                    width: fit-content;
                    padding: 15px 30px;
                    margin: 40px 0;
                    border: unset;
                    border-radius: 15px;
                    color: white;
                    z-index: 1;
                    background: #506bec;
                    position: relative;
                    font-weight: 600;
                    font-size: 1rem;
                    letter-spacing: 0.5px;
                    box-shadow: 1px 1px 20px 3px #9ea3ff;
                    overflow: hidden;">Reset My Password</div>
                </a>
    
                <p class="para" style="  margin: 20px 0;
      font-size: 1rem;
      font-weight: 200;
      font-family: sans-serif;
      color: #525050;">Having trouble? (Call your senior)</p>
                <p class="para" style="  margin: 20px 0;
      font-size: 1rem;
      font-weight: 200;
      font-family: sans-serif;
      color: #525050;">Didn’t request a password reset? You can ignore this message.</p>
                <p class="para" style="  margin: 20px 0;
      font-size: 1rem;
      font-weight: 200;
      font-family: sans-serif;
      color: #525050;">It is valid for only 15 minutes.</p>
    
            </div>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                // console.log(error);
                res.status(200).json({
                    message: `Hi ${name.toUpperCase()}, There is a problem while sending password reset link to your email`, status: false
                });

            } else {
                console.log(info);
                res.status(200).json({
                    message: `Hi ${name.toUpperCase()}, A password reset link has been sent to your email. It will be valid for 15 miniutes only`, status: true
                });
            }
        })

    }

}

export default Mail;