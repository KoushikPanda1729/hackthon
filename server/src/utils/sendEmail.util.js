import nodemailer from "nodemailer";
import ApiError from "./ApiErrors.util.js";

const sendMail = async (receiverEmails, subjectToSend, userDetails) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const userMessage = `
      Hello ${userDetails.userName},

      Congratulations! You have completed the test successfully.

      Here are your results:
      - Email: ${userDetails.email}
      - Obtained Marks: ${userDetails.obtainedMarks}
      - Total Marks: ${userDetails.totalMarks}

      Thank you for participating!

      Best regards,
      HireLence Team
    `;

    const adminMessage = `
      Hello Admin,

      User ${userDetails.userName} (${userDetails.email}) has completed the test.
      
      Here are the user's results:
      - Email: ${userDetails.email}
      - Obtained Marks: ${userDetails.obtainedMarks}
      - Total Marks: ${userDetails.totalMarks}

      Please review the details.

      Best regards,
      HireLence Team
    `;

    await transporter.sendMail({
      from: '"HireLence Pvt. Ltd." <panda747767@gmail.com>',
      to: receiverEmails[0],
      subject: subjectToSend,
      text: userMessage,
    });

    await transporter.sendMail({
      from: '"HireLence Pvt. Ltd." <panda747767@gmail.com>',
      to: receiverEmails[1],
      subject: subjectToSend,
      text: adminMessage,
    });

    console.log("Emails sent to user and admin");
  } catch (error) {
    console.log("error>>>> ", error);
    throw new ApiError(400, "Error occurred while sending Emails");
  }
};

export default sendMail;
