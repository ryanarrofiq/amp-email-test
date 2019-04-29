const fs = require('fs');

const config = require('./config');
const mailer = require('./mailer');

const sendPromotionalEmail = function(receiver, ampFile) {
  // edit config.js for your gmail credentials
  const gmailAccount = config.gmailAccount;

  const params = {
    to: [receiver], // list of receivers
    subject: 'Test AMP Email ' + Math.random().toString(36).substr(2, 9),
    text: 'This is a dynamic email but your email client does not support it',
    html: `
      <p>This is a dynamic email.</p>
      <p>
        To check dynamic content, whitelist my email in 
        <b>
          Gmail Settings > General > Dynamic email > Dynamic email development
        </b>
      </p>
    `,
    amp: ''
  };

  // read the dynamic-email html file
  fs.readFile(ampFile, function(error, data) {
    if (error) {
      console.trace(error);
    } else {
      params.amp = data;
      mailer.sendEmail(gmailAccount, params, (error) => {
        console.error('Failed to send email');
        console.trace(error);
      }, (info) => {
        console.log('Message sent: %s', info.messageId);
      });
    }
  });
};

const getAmpFile = (value) => {
  let ampFile = ''

  if (value === '1') ampFile = 'index'
  else if (value === '2') ampFile = 'accordion'
  else if (value === '3') ampFile = 'anim'
  else if (value === '4') ampFile = 'bind-1'
  else if (value === '5') ampFile = 'bind-2'
  else if (value === '6') ampFile = 'carousel-1'
  else if (value === '7') ampFile = 'carousel-2'
  else if (value === '8') ampFile = 'fit-text'
  else if (value === '9') ampFile = 'form'
  else if (value === '10') ampFile = 'list-1'
  else if (value === '11') ampFile = 'list-2'
  else if (value === '12') ampFile = 'timeago'
  else ampFile = 'index'

  return `./amp-files/${ampFile}.html`
}

const stdin = process.openStdin();
const inputReceiver = (choice) => {
  console.log('Sending dynamic email using amp4email-');
  console.log("Enter receiver's email");
  stdin.addListener('data', function(data) {
    const receiverEmail = data.toString().trim();
    const selectedAmp = (choice) ? getAmpFile(choice.toString().trim()) : getAmpFile('0')
    sendPromotionalEmail(receiverEmail, selectedAmp)
  })
}

inputReceiver()