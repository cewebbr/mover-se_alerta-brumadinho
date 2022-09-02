const cnpjCheck = require('cnpj');;
const PublicAgencies = require('../models/publicAgency');
const Residents = require('../models/resident');
const Categories = require('../models/category');
const Comments = require('../models/comment');
const Denunciations = require('../models/denunciation');
const jwt = require ('jsonwebtoken');

/**
 * @description This function receives a token and returns the logged user.
 * @returns The logged in user or 'undefined'.
 */
 async function getUser (token) {
  if (token !== '') {
    try {
      // Decoding the token
      const decoded = await jwt.verify(token, process.env.JWT_PASS);
      if (decoded !== null) {
        // Searching for the user
        var user = await Residents.findById(decoded.id);

        if (!user) {
          user = await PublicAgencies.findById(decoded.id);
          if (!user) return undefined;
        }
        return user;

      }
      return undefined;

    } catch (err) {
      return undefined;
    }
  }
  return undefined;
}

/**
 * @description This function validates a cnpj number.
 * @param cnpj Number of cnpj to validate.
 * @returns True or false.
 */
const isCnpj = cnpj => cnpjCheck.validate(cnpj);

/**
 * @description This function creates a user token from your id.
 * @param userId User id.
 * @returns Returns the generated token.
 */
const createToken = (id) => {
  return jwt.sign({id: id}, process.env.JWT_PASS, {expiresIn: process.env.JWT_EXPIRES_IN});
}

/**
 * @description This function validates a password reset token.
 * @param token Token to validate.
 * @returns Returns the user if the token is valid, or error.
 */
const validatePasswordResetToken = async function (token) {
  try {

    // Looking for the received token
    var user = await Residents.findOne({
      passwordResetToken: token
    }).select('+passwordResetExpires');

    if (!user) {
      user = await PublicAgencies.findOne({
        passwordResetToken: token
      }).select('+passwordResetExpires')
      
      if (!user) return {data: undefined, message: 'Unregistered token'};
    }
    
    // Checking expiration
    const newDate = new Date();
    let now = new Date(newDate.valueOf() - newDate.getTimezoneOffset() * 60000);
    if (now > user.passwordResetExpires) return {data: undefined, message: 'Expired token'};

    return {data: user, message: ''};
  } catch (err) {
    if (err) return {data: undefined, message: err};
  }
}

const getDenunciationSubcollections = async function (data) {
  try {
    var category = await Categories.findOne({_id: data.category});
  } catch (err) {
    if (err) return {data: undefined, message: 'Error fetching categories!'};
  }

  try{
    var publisher = await Residents.findOne({_id: data.publisher});
  } catch (err) {
    if (err) return {data: undefined, message: 'Error fetching publisher!'};
  }

  try {
    var likes = await Residents.find({'_id': { $in: data.likes}});
  } catch (err) {
    if (err) return {data: undefined, message: 'Error fetching residents who liked!'};
  }

  try {
    var comments = await Comments.find({'_id': { $in: data.comments}});
  } catch (err) {
    if (err) return {data: undefined, message: 'Error fetching comments!'};
  }

  return {data: {category, publisher, likes, comments}, message: ''};
}

const generateSearchId = async function () {
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var text = "";

  do {
    text = "";
    
    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

  } while (await Denunciations.findOne({searchId: text}));

  return text;
}

const getFirstName = fullName => fullName.split(' ')[0];

module.exports = {
  getUser,
  createToken, 
  isCnpj, 
  validatePasswordResetToken,
  getDenunciationSubcollections,
  generateSearchId,
  getFirstName
}
