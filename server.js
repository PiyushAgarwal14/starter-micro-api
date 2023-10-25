const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
const fs = require("fs");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({ origin: "*" }));
app.use("/public", express.static(process.cwd() + "/public"));

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'piyushagarwalplay@gmail.com',
    pass: 'xuxnoomzbukrnwvf',
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

app.post("/send", (req, res) => {
  let form = new multiparty.Form();

  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log(err);
      res.status(500).send("Error parsing form data.");
      return;
    }

    const data = {};
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });

    const mail = {
      sender: `${data.name} <${data.email}>`,
      to: 'piyushagarwalplay@gmail.com',
      subject: data.subject,
      text: `${data.name} <${data.email}> \n${data.message}`,
    };

    if (files && files.attachment && files.attachment[0]) {
      const attachment = {
        filename: files.attachment[0].originalFilename,
        content: fs.createReadStream(files.attachment[0].path),
      };

      mail.attachments = [attachment];
    }

    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong.");
      } else {
        res.status(200).send("Email successfully sent to recipient!");
      }
    });
  });
});

app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/public/index.html");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
