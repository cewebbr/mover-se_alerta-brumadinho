const Residents = require('../models/resident');
const sgMail = require('@sendgrid/mail');
const utils = require('./utils');

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
    process.env.SENDGRID_TID_REDEFINE_PASSWORD,
    {
      "name": utils.getFirstName(data.user.name),
      "tokenUrl": data.resetPassTokenUrl,
      "expiresIn": "30",
      "forgotLink": process.env.URL_FRONT_FORGOT_MY_PASSWORD
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

  var template_id = process.env.SENDGRID_TID_DENUNCIATION_REJECTED;
  var obj = {
    "name": utils.getFirstName(publisher.name),
    "rejectionReason": data.denunciation.rejection_reason,
    "codeOfConductUrl": process.env.URL_FRONT_CODE_OF_CONDUCT,
  };

  if (data.status == 'accepted') {
    obj = {
      "name": utils.getFirstName(publisher.name),
      "denunciationUrl": `${process.env.URL_FRONT}/denunciations/${data.denunciation.searchId}`
    }
    template_id = process.env.SENDGRID_TID_DENUNCIATION_ACCEPTED;
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
    process.env.SENDGRID_TID_AGENCY_COMMENTED,
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
        process.env.SENDGRID_TID_DENUNCIATION_CREATED,
        {
          "name": utils.getFirstName(auditor.name),
          "validateDenunciationsUrl": process.env.URL_FRONT_VALIDATE_DENUNCIATIONS,
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
        process.env.SENDGRID_TID_AGENCY_CREATED,
        {
          "name": utils.getFirstName(admin.name),
          "validateAgenciesUrl": process.env.URL_FRONT_VALIDATE_AGENCIES,
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
    process.env.SENDGRID_TID_YOU_ARE_AUDITOR,
    {
      "name": utils.getFirstName(data.resident.name),
      "codeOfConductUrl": process.env.URL_FRONT_CODE_OF_CONDUCT,
      "validateDenunciationsUrl": process.env.URL_FRONT_VALIDATE_DENUNCIATIONS
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
    process.env.SENDGRID_TID_YOU_CREATED_DENUNCIATION,
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
