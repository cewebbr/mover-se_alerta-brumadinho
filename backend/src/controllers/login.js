const bcrypt = require ('bcrypt');
const {getUser} = require('./utils');
const PublicAgencies = require('../models/publicAgency');
const Residents = require('../models/resident');
const {createToken, validatePasswordResetToken} = require('./utils');
const sendEmail = require('./sendEmail');
const crypto = require('crypto');
const {validateLogin} = require('../validation/login');

/**
 * @description This function authenticates a user from a password. 
 * @returns Returns the authenticated user or the error status.
 */
const auth = async function(req, res) {
  const {email, password} = req.body;

  const val = validateLogin.validate({
    email, 
    password
  }, { context: { function: 'auth' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Looking for the user
  try {
    var user = await Residents.findOne({email}).select('+password');
    if (!user) {
      user = await PublicAgencies.findOne({email}).select('+password');
      if (!user) return res.status(400).send({error: 'Invalid email!'});
      if (user.verification == 'unverified') return res.status(201).send({error: 'Public Agency unverified!'});
      if (user.verification == 'rejected') return res.status(201).send({error: 'Public Agency rejected!'});
    }

    const pass_ok = await bcrypt.compare(password, user.password);
    if (!pass_ok) return res.status(401).send({error: 'Error authenticating the user!'});
    
    user.password = undefined;
    return res.send({user, token: createToken(user.id)});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching email!'});
  }
}

/**
 * @description This function sends an email with a password recovery link and stores the token in the user's data.
 * @returns Returns status 200 or error.
 */
const forgotPassword = async function (req, res) {
  const email = req.body.email;

  const val = validateLogin.validate({email}, { context: { function: 'forgotPassword' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});
  
  try {
    var user = await Residents.findOne({email});
    if (!user) {
      user = await PublicAgencies.findOne({email});
      if (!user) return res.status(400).send({error: 'Email not registered!'});
    }

    // Generating token
    do {
      var token = crypto.randomBytes(20).toString('hex');
    } while(await Residents.findOne({passwordResetToken: token}) || await PublicAgencies.findOne({passwordResetToken: token}));
    
    // Creating expiration date
    const now = new Date();
    let expires = new Date(now.valueOf() - now.getTimezoneOffset() * 60000);
    await expires.setMinutes(expires.getMinutes() + 30);

    // Saving information in user data
    await user.updateOne({
      passwordResetToken: token, 
      passwordResetExpires: expires
    });

    // Generating the password reset link
    const resetPassTokenUrl = `${process.env.URL_FRONT_REDEFINE_PASSWORD}/${token}`;

    // Sending email
    sendEmail.sendEmailResetPassword({email, user, resetPassTokenUrl}, function(err) {});

    return res.status(200).send({message: 'Password reset email sent successfully!'});
    
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching user!'});
  }
}

/**
 * @description This function validates a password reset token.
 * @returns Returns the user if the token is valid, or error.
 */
const confirmToken = async function (req, res) {
  const {token} = req.body;

  const val = validateLogin.validate({token}, { context: { function: 'confirmToken' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});
    
  try {

    // Calling function to validate token 
    const user = await validatePasswordResetToken(token);
  
    if(!(user.data)) return res.status(400).send({error: user.message});
  
    else return res.status(200).send(user.data);
  
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error verifying token!'});
  }
}

/**
 * @description This function resets the user's password.
 * @returns Returns the modified user instance or the error status.
 */
const redefinePassword = async function (req, res) {
  var {
    token, 
    password
  } = req.body;

  const val = validateLogin.validate({
    token, 
    password
  }, { context: { function: 'redefinePassword' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  try {
    // Calling function to validate token 
    var user = await validatePasswordResetToken(token);
  
    if(!user.data) return res.status(400).send({error: user.message});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error verifying token!'});
  }

  // Encrypting password
  password = await bcrypt.hash(password, 10);

  // Deleting password reset token
  try {
    await user.data.updateOne({
      passwordResetToken: null,
      passwordResetExpires: null
    });
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error deleting token of password reset!'});
  }

  // Updating password
  try {
    const ret = await user.data.updateOne({password: password});
    if (ret) return res.status(200).send({ret});
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error updating resident!'});
  }
}

/**
 * @description This function returns the user belonging to the token.
 * @returns Returns the user instance or the error status.
 */
const getUserFromToken = async function (req, res) {
  const {token} = req.params;

  const val = validateLogin.validate({token}, { context: { function: 'getUserFromToken' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  const user = await getUser(token);

  if(!user) res.status(400).send({error: 'Invalid token!'});
  
  return res.send(user);
}

module.exports = {
  auth, 
  forgotPassword, 
  confirmToken, 
  redefinePassword, 
  getUserFromToken
};
