// utils/otpUtils.js
const nodemailer = require("nodemailer");

// Function to generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Function to send OTP to the provided email
async function sendOTPByEmail(email, otp) {
  // Create a transporter object using Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "info.seveneleven@gmail.com",
      pass: "osnusaeabpwksyxu",
    },
  });

  // Email message configuration
  const mailOptions = {
    from: "sevenEleven@sevenEleven.com", // Sender's email address
    to: email, // Recipient's email address
    subject: "Your One-Time Password (OTP) for Verification",
    text: `Dear User,

Your One-Time Password (OTP) is: ${otp}

This OTP is valid for 3 minutes. Please do not share it with anyone.

If you did not request this, please ignore this message.

Thank you,
Seven Eleven`,
    // subject: "OTP for Verification",
    // text: `Your OTP for Verification is: ${otp}. It will expire in 3 minutes.`,
  };

  // Send email
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}

module.exports = {
  generateOTP,
  sendOTPByEmail,
};

// // utils/otpUtils.js
// const nodemailer = require("nodemailer");

// // Function to generate a random 6-digit OTP
// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000);
// }

// // Function to send OTP to the provided email
// async function sendOTPByEmail(email, otp) {
//   // Create a transporter object using Gmail SMTP
//   // const transporter = nodemailer.createTransport({
//   //   service: "gmail",
//   //   auth: {
//   //     user: "lapp4859@gmail.com",
//   //     pass: "gehvfdflyaofjvis",
//   //   },
//   // });
//   const transporter = nodemailer.createTransport({
//     host: "smtp.mailersend.net",
//     port: 587,
//     secure: false,
//     auth: {
//       user: "MS_YqrgUZ@trial-351ndgwk0oxgzqx8.mlsender.net",
//       pass: "QZxwkpwQLwH79dfI",
//     },
//   });
//   // Email message configuration
//   const mailOptions = {
//     from: "lapp4859@gmail.com", // Sender's email address
//     to: email, // Recipient's email address
//     subject: "OTP for Password Reset",
//     text: `Your OTP for password reset is: <b>${otp}<b>. It will expire in 3 minutes.`,
//   };

//   // Send email
//   await transporter.sendMail(mailOptions);
// }

// module.exports = {
//   generateOTP,
//   sendOTPByEmail,
// };

// // utils/otpUtils.js
// require('dotenv').config();
// const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

// const mailerSend = new MailerSend({
//   apiKey: process.env.API_KEY,
// });

// // Function to generate a random 6-digit OTP
// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000);
// }

// // Function to send OTP to the provided email
// async function sendOTPByEmail(email, otp) {
//   const sentFrom = new Sender("trial-351ndgwk0oxgzqx8.mlsender.net", "Hacker");
//   const recipients = [new Recipient("ashokarun385@gmail.com", "Hacker")];
//   const variables = [
//     {
//       email: "ashokarun385@gmail.com",
//       substitutions: [
//         {
//           var: 'otp',
//           value: "otp"
//         }
//       ],
//     }
//   ];

//   const emailParams = new EmailParams()
//     .setFrom(sentFrom)
//     .setTo(recipients)
//     .setReplyTo(sentFrom)
//     .setVariables(variables)
//     .setSubject("OTP for Password Reset")
//     .setHtml(`Your OTP for password reset is: {otp}. It will expire in 3 minutes.`);

//   await mailerSend.email.send(emailParams);
// }

// module.exports = {
//   generateOTP,
//   sendOTPByEmail,
// };

// // utils/otpUtils.js
// const nodemailer = require("nodemailer");

// // Function to generate a random 6-digit OTP
// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000);
// }

// // Function to send OTP via OneSignal
// async function sendOTPByOneSignal(userId, otp) {
//   const apiKey = "ZTIzYWIxMjQtZDY2ZS00ZThlLWEzZjctODA4OTQyYjhjYzQy";
//   const appId = "fa48a3c0-df79-4502-8ff3-79d10020c529";

//   // Dynamically import node-fetch
//   const fetch = await import('node-fetch').then(module => module.default);

//   const notification = {
//     app_id: appId,
//     contents: { en: `Your OTP for password reset is: ${otp}. It will expire in 3 minutes.` },
//     include_player_ids: [userId],
//   };

//   const response = await fetch("https://onesignal.com/api/v1/notifications", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Basic ${apiKey}`,
//     },
//     body: JSON.stringify(notification),
//   });

//   if (response.ok) {
//     return true;
//   } else {
//     const errorData = await response.json();
//     throw new Error(`Failed to send OTP via OneSignal: ${errorData.errors}`);
//   }
// }

// module.exports = {
//   generateOTP,
//   sendOTPByOneSignal,
// };

// // utils/otpUtils.js
// const nodemailer = require("nodemailer");

// // Function to generate a random 6-digit OTP
// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000);
// }

// // Function to send OTP to the provided email
// async function sendOTPByEmail(email, otp) {
//   // Create a transporter object using Gmail SMTP
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "lapp4859@gmail.com",
//       pass: "gehvfdflyaofjvis",
//     },
//   });

//   // const transporter = nodemailer.createTransport({
//   //   host: "mail.goltens.a2hosted.com",
//   //   port: 465, // or your SMTP port
//   //   secure: false, // true for 465, false for other ports
//   //   auth: {
//   //     user: "tempuser@goltens.a2hosted.com",
//   //     pass: "Coder385@",
//   //   },
//   // });
//   // Email message configuration
//   const mailOptions = {
//     from: "Quarry@gmail.com", // Sender's email address
//     to: email, // Recipient's email address
//     subject: "OTP for Password Reset",
//     text: `Your OTP for password reset is: <b>${otp}<b>. It will expire in 3 minutes.`,
//   };

//   // Send email
//   await transporter.sendMail(mailOptions);
// }

// module.exports = {
//   generateOTP,
//   sendOTPByEmail,
// };
