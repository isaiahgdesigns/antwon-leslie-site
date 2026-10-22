/**
 * Contact form backend for the Antwon Leslie site.
 * Receives the form POST and emails it to the owner. Optionally logs each message to a Google Sheet.
 *
 * Setup is in README.md. Short version:
 *   1. Set OWNER_EMAIL below.
 *   2. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 *   3. Paste the web app URL into formEndpoint in config.js.
 */
var OWNER_EMAIL = 'REPLACE_WITH_HIS_EMAIL@example.com';
var SHEET_ID = ''; // optional: ID of a Google Sheet to keep a log of messages
var MAX_MESSAGE = 4000;

function doPost(e) {
  try {
    var p = (e && e.parameter) || {};

    // Spam trap: the hidden "website" field must stay empty
    if (p.website) return reply_({ ok: true });

    var name = clean_(p.name, 100);
    var email = clean_(p.email, 150);
    var org = clean_(p.org, 150);
    var reason = clean_(p.reason, 60) || 'General';
    var message = clean_(p.message, MAX_MESSAGE);

    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !message || !emailOk) return reply_({ ok: false, error: 'invalid' });

    // One message per email address per minute
    var cache = CacheService.getScriptCache();
    var key = 'rl_' + Utilities.base64EncodeWebSafe(email).slice(0, 80);
    if (cache.get(key)) return reply_({ ok: false, error: 'slow_down' });
    cache.put(key, '1', 60);

    var subject = ('[Site inquiry] ' + reason + ': ' + name).replace(/[\r\n]+/g, ' ');
    var body = [
      'New message from the website.',
      '',
      'Name: ' + name,
      'Email: ' + email,
      'Company or team: ' + (org || 'not given'),
      'Topic: ' + reason,
      '',
      message,
      '',
      'Reply to this email to answer them directly.'
    ].join('\n');

    MailApp.sendEmail({
      to: OWNER_EMAIL,
      replyTo: email,
      subject: subject,
      body: body,
      name: 'Antwon Leslie website'
    });

    if (SHEET_ID) {
      SpreadsheetApp.openById(SHEET_ID).getSheets()[0]
        .appendRow([new Date(), name, email, org, reason, message]);
    }

    return reply_({ ok: true });
  } catch (err) {
    console.error(err);
    return reply_({ ok: false, error: 'server' });
  }
}

// Lets you open the web app URL in a browser to confirm it deployed.
function doGet() {
  return reply_({ ok: true, service: 'contact form' });
}

function clean_(value, max) {
  return String(value == null ? '' : value).replace(/\u0000/g, '').trim().slice(0, max);
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
