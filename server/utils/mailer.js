const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

exports.sendInvite = (to, pollId, pollTitle) =>
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: `You're invited to vote: "${pollTitle}"`,
    html: `<p>Click <a href="http://localhost:5173/poll/${pollId}">here</a> to vote on <b>${pollTitle}</b>.</p>`,
  });

exports.sendResults = (to, poll) => {
  const resultsHtml = poll.options
    .map(o => `<li>${o.text}: <b>${o.votes} votes</b></li>`)
    .join('');
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: `Poll results are in: "${poll.title}"`,
    html: `<h2>${poll.title}</h2><ul>${resultsHtml}</ul>`,
  });
};