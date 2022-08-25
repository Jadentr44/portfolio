const express = require('express');
const path = require('path');
var nodemailer = require('nodemailer');
require('dotenv').config();

// Helper method for generating unique ids

const PORT = process.env.PORT || 5000;
const publicPath = path.join(process.cwd(), 'project')
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(publicPath));

app.get('/', (req,res) =>{
  res.sendFile(path.join(publicPath, 'index.html'))
})

//api call to send email to me
app.post('/sendEmail', (req, res) =>{
let emailInfo = req.body

//email auth
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER,
    pass: process.env.PASSWORD
  },tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
}
});

//email information
var mailOptions = {
  from: process.env.SENDER,
  to: process.env.RECIPIENT,
  subject: `PORTFOLIO-from:${emailInfo.name}`,
  text: `from: ${emailInfo.name}
  email: ${emailInfo.email}
  message:
  ${emailInfo.message}  
  `
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    res.status(500).json(error);
    return
  }

  res.status(200).json('Email sent: ' + info.response);
  
});
});



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
