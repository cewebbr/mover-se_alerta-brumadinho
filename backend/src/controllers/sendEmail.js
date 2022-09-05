const Residents = require('../models/resident');
const sgMail = require('@sendgrid/mail');
const utils = require('./utils');

const SENDGRID_TID_AGENCY_COMMENTED='d-128da244b2c84ab386f05fbedfd6e9d9';
const SENDGRID_TID_AGENCY_CREATED='d-4b92d976154146498c69146785e5c148';
const SENDGRID_TID_AGENCY_ACCEPTED='d-49fff2d5cbb44dbdb861c467b886c16c';
const SENDGRID_TID_AGENCY_REJECTED='d-717ad3d47bbf4f2ca48c2ceaf3341697';
const SENDGRID_TID_DENUNCIATION_ACCEPTED='d-d688788d24c640159e28f7e68df144e7';
const SENDGRID_TID_DENUNCIATION_CREATED='d-675412f46f094ccc8f808fc1094933ed';
const SENDGRID_TID_DENUNCIATION_REJECTED='d-0b72634cd1e54406b1cc7fc0c4bbed72';
const SENDGRID_TID_YOU_ARE_AUDITOR='d-18d0a9cea87d4208a36073ff001f6e47';
const SENDGRID_TID_YOU_CREATED_DENUNCIATION='d-73e6c3f94e694cb38f7148ebea5d29ad';
const SENDGRID_TID_REDEFINE_PASSWORD='d-a14d32a978704e1095f2142b2946061a';
const SENDGRID_TID_CONFIRM_EMAIL='d-5b50ae798680446eab4052ff6c8d126f'; 

/**
 * @description This function sends an email to the recipient passed by parameter.
 * @param to  Recipient's email.
 * @param template Email template_id.
 * @param data Email data (variables).
 */
const sendEmail = async function (to, template, data, callback) {
  try {
    await sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      "from": {
         "email": process.env.SENDGRID_EMAIL_SENDER
      },
      "personalizations": [
         {
            "to": [
               {
                  "email": to
               }
            ],
            "dynamic_template_data": data
         }
      ],
      "template_id": template
    }

    await sgMail.send(msg);

    return callback(null);

  } catch (err) {
    if (err) return callback ("Error send email!");
  }
}

const sendEmailResetPassword = async function (data, callback) {

  await sendEmail(
    data.email, 
    SENDGRID_TID_REDEFINE_PASSWORD,
    {
      "name": utils.getFirstName(data.user.name),
      "tokenUrl": data.resetPassTokenUrl,
      "expiresIn": "30",
      "forgotLink": `${process.env.URL_FRONT}/forgot`
    },
    function (err) {
      if (err) return callback(err);

      return callback();
    }
  );
}

const sendEmailDenunciationValidated = async function (data, callback) {
  // Fetching publisher
  try {
    var publisher = await Residents.findOne({_id: data.denunciation.publisher});
    
    if (!publisher) return callback('Unregistered publisher!');

  } catch (err) {
    if (err) return callback('Error fetching publisher!');
  }

  var template_id = SENDGRID_TID_DENUNCIATION_REJECTED;
  var obj = {
    "name": utils.getFirstName(publisher.name),
    "rejectionReason": data.denunciation.rejection_reason,
    "codeOfConductUrl": `${process.env.URL_FRONT}/codeOfConduct`,
  };

  if (data.status == 'accepted') {
    obj = {
      "name": utils.getFirstName(publisher.name),
      "denunciationUrl": `${process.env.URL_FRONT}/denunciations/${data.denunciation.searchId}`
    }
    template_id = SENDGRID_TID_DENUNCIATION_ACCEPTED;
  }

  await sendEmail(
    publisher.email, 
    template_id,
    obj,
    function (err) {
      if (err) return callback(err);

      return callback();
    }
  );
}

const sendEmailAgencyCommented = async function (data, callback) {
  // Fetching publisher
  try {
    var publisher = await Residents.findOne({_id: data.denunciation.publisher});
    
    if (!publisher) return callback('Unregistered publisher!');

  } catch (err) {
    if (err) return callback('Error fetching publisher!');
  }

  await sendEmail(
    publisher.email, 
    SENDGRID_TID_AGENCY_COMMENTED,
    {
      "name": utils.getFirstName(publisher.name),
      "agencyName": data.user.name,
      "denunciationUrl": `${process.env.URL_FRONT}/denunciations/${data.denunciation.searchId}`
    },
    function (err) {
      if (err) return callback(err);

      return callback();
    }
  );
}

const sendEmailDenunciationCreated = async function (data, callback) {
  // Fetching auditors
  try {
    var auditors = await Residents.find({
      type: "auditor",
      city: data.denunciation.city, 
      uf: data.denunciation.uf,
    });
    
  } catch (err) {
    if (err) return callback('Error fetching publisher!');
  }

  if (auditors) {
    auditors.forEach(async (auditor) => {
      await sendEmail(
        auditor.email, 
        SENDGRID_TID_DENUNCIATION_CREATED,
        {
          "name": utils.getFirstName(auditor.name),
          "validateDenunciationsUrl": `${process.env.URL_FRONT}/audit`,
        },
        function () {}
      );
    })
  }
  return callback();
}

const sendEmailAgencyCreated = async function (data, callback) {
  // Fetching admins
  try {
    var admins = await Residents.find({type: "admin"});
  } catch (err) {
    if (err) return callback('Error fetching publisher!');
  }

  if (admins) {
    admins.forEach(async (admin) => {
      await sendEmail(
        admin.email, 
        SENDGRID_TID_AGENCY_CREATED,
        {
          "name": utils.getFirstName(admin.name),
          "validateAgenciesUrl": `${process.env.URL_FRONT}/validadeAgencies`,
        },
        function () {}
      );
    })
  }
  return callback();
}

const sendEmailYouAreAuditor = async function (data, callback) {
  
  await sendEmail(
    data.resident.email, 
    SENDGRID_TID_YOU_ARE_AUDITOR,
    {
      "name": utils.getFirstName(data.resident.name),
      "codeOfConductUrl": `${process.env.URL_FRONT}`,
      "validateDenunciationsUrl": `${process.env.URL_FRONT}/audit`
    },
    function (err) {
      if (err) return callback(err);

      return callback();
    }
  );
}

const sendEmailSearchId = async function (data, callback) {

  await sendEmail(
    data.publisher.email, 
    SENDGRID_TID_YOU_CREATED_DENUNCIATION,
    {
      "name": utils.getFirstName(data.publisher.name),
      "searchId": data.denunciation.searchId
    },
    function (err) {
      if (err) return callback(err);

      return callback();
    }
  );
}

module.exports = {
  sendEmailResetPassword,
  sendEmailDenunciationValidated,
  sendEmailAgencyCommented,
  sendEmailDenunciationCreated,
  sendEmailAgencyCreated,
  sendEmailYouAreAuditor,
  sendEmailSearchId
}
