const nodemailer = require("nodemailer");
const { EMAIL, EMAIL_PASS } = require('../utils/helpers')
const sendMail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL,
      to,
      subject,
      html: htmlContent,  // Use HTML content instead of plain text
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendMail;
