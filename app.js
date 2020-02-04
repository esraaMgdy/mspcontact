const http = require('http');
var fs = require('fs');
const nStatic = require('node-static');
const path = require('path');
const nodemailer = require('nodemailer');



//api
var server = http.createServer(function (req, res) {
  console.log('request was made : ' + req.url); 
  if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
       var myReadStream = fs.createReadStream(__dirname + "./index.html", "UTF-8");
       myReadStream.pipe(res);
  } 

  else if (req.url === "/send") {
    res.writeHead(200, { "Content-Type": "application/json" });
     var output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;
    
    res.end(JSON.stringify(output));

    }

  
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'mail.YOURDOMAIN.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'YOUREMAIL', // generated ethereal user
        pass: 'YOURPASSWORD'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Nodemailer Contact" <your@email.com>', // sender address
      to: 'RECEIVEREMAILS', // list of receivers
      subject: 'Node Contact Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  

});

server.listen(3000);
console.log('listening on port 3000 ...');
