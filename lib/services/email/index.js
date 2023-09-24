const fse = require('fs-extra');
const {Liquid} = require('liquidjs');
const nodemailer = require('nodemailer');
const path = require('path');

let singletonTransporter;
let singletonOpts;

const liquidEngine = new Liquid({
  root: [path.resolve(__dirname, 'templates')],
  extname: '.liquid',
});

async function initEmailSingleton(connection, opts) {
  if (singletonTransporter) {
    return;
  }

  singletonOpts = opts;

  if (connection.transport === 'sendmail') {
    singletonTransporter = nodemailer.createTransport({
      sendmail: true,
      newline: connection.sendmail.newline || 'unix',
      path: connection.sendmail.path || '/usr/sbin/sendmail',
    });
  } else if (connection.transport === 'smtp') {
    let auth = {};

    if (connection.smtp.user || connection.smtp.pass) {
      auth = {
        user: connection.smtp.user,
        pass: connection.smtp.pass,
      };
    }

    singletonTransporter = nodemailer.createTransport({
      pool: connection.smtp.pool,
      host: connection.smtp.host,
      port: connection.smtp.port,
      secure: connection.smtp.secure,
      auth: auth,
    });
  } else {
    const error = new Error(
      'Illegal transport given for email. Check the EMAIL_TRANSPORT env var.'
    );
    console.log(error);
    return;
  }

  await new Promise((resolve, reject) => {
    singletonTransporter.verify((error) => {
      if (error) {
        console.log('Email connection error');
        return reject(error);
      } else {
        console.log('Email connection established');
      }

      return resolve({});
    });
  });
}

async function send(template, emailOpts, payload) {
  const html = await renderTemplate(template, payload);

  await sendRaw({
    ...emailOpts,
    from: singletonOpts.from,
    html,
  });
    
}

async function sendRaw(emailOpts) {
  const recipients = [
    ...toRecipients(emailOpts.to),
    ...toRecipients(emailOpts.cc),
    ...toRecipients(emailOpts.bcc),
  ];

  // by default, send email to self
  if (recipients.length === 0) {
    recipients.push(singletonOpts.from);
    emailOpts.to = singletonOpts.from;
  }

  await singletonTransporter.sendMail({
    ...emailOpts,
    from: singletonOpts.from,
  });
}

function toRecipients(recipients) {
  if (!recipients) {
    return [];
  }
  return typeof recipients === 'string'
    ? recipients.split(',')
    : !Array.isArray(recipients)
    ? [recipients]
    : recipients;
}

async function renderTemplate(template, payload) {
  const templatePath = path.join(__dirname, 'templates', template + '.liquid');

  const pathExists = await fse.pathExists(templatePath);
  if (!pathExists) {
    throw new Error(`Template "${template}" doesn't exist.`);
  }

  const templateString = await fse.readFile(templatePath, 'utf8');
  const html = await liquidEngine.parseAndRender(templateString, payload);

  return html;
}

module.exports = {
  initEmailSingleton,
  send,
  sendRaw,
};
