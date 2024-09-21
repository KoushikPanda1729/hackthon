import nodemailer from "nodemailer";
import ApiError from './ApiErrors.util.js';

const sendMail = async (reciverEmail, subjectToSend, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      service: "gmail",
      secure: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Plantopia pvt.limited" <panda747767@gmail.com>', // sender address
      to: reciverEmail, // list of receivers
      subject: subjectToSend, // Subject line
      text: otp
        ? `Your OTP is :  ${otp}`
        : `User verification successfully completed`, // plain text body
    });
  } catch (error) {
    console.log("error>>>> ", error);
    throw new ApiError(400, "Error occured while sending Email");
  }
};

export default sendMail;