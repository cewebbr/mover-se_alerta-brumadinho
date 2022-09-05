const Comments = require('../models/comment');
const Denunciations = require('../models/denunciation');
const {validatePermissions} = require('../validation/permissions');
const {getUser} = require('../controllers/utils');

/**
 * @description This function checks if the logged in user is an administrator.
 * @returns True or false.
 */
async function admin (token) {
  const user = await getUser(token);

  if (!user) return false;

  if (user.type == 'admin') return true;

  return false;
}

/**
 * @description This function checks if the logged in user is an auditor.
 * @returns True or false.
 */
async function auditor (token) {
  const user = await getUser(token);

  if (!user) return false;
    
  if (user.type == 'auditor') return true;
      
  return false;
}

/**
 * @description This function checks if the logged in user is an common user.
 * @returns True or false.
 */
async function common (token) {
  const user = await getUser(token);

  if (!user) return false;

  if (user.type == 'common') return true;

  return false;
}

/**
 * @description This function checks if the logged in user is an public agency.
 * @returns True or false.
 */
async function publicAgency (token) {
  const user = await getUser(token);

  if (!user) return false;
   
  if (user.type == 'agency') return true;
      
  return false;
}

/**
 * @description This function checks if the email of the logged in user is the same as the parameter.
 * @returns True or false.
 */
async function himself (token, uniqueData) {
  const user = await getUser(token);

  if (user !== undefined) {

    if (user.email == uniqueData) return true;

    return false;
  }
  return false;
}

/**
 * @description This function authenticates a owner of comment.
 * @returns true or false.
 */
 async function myComment (token, id) {
  const user = await getUser(token);

  if (!user) return false;

  try {
    var comment = await Comments.findOne({_id: id});
    
    if (!comment) return false;

  } catch (err) {
    return false;
  }

  if (user.id == comment.publisher) return true

  return false;
}

/**
 * @description This function authenticates a owner of denunciation.
 * @returns true or false.
 */
 async function myDenunciation (token, id) {
  const user = await getUser(token);

  if (!user) return false;
  
  try {
    var denunciation = await Denunciations.findOne({_id: id});
    
    if (!denunciation) return false

  } catch (err) {
    return false;
  }

  if (user.id == denunciation.publisher) return true

  return false;
}

/**
 * @description This function authenticates an user.
 * @returns next() or 401 status.
 */
const isUser = async function (req, res, next) {
  const {token} = req.headers;

  const val = validatePermissions.validate({
    token
  }, { context: { function: 'isUser' } });
  
  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  if (await getUser(token)) return next();
  else return res.status(401).end();
}

/**
 * @description This function authenticates an admin user.
 * @returns next() or 401 status.
 */
const isAdmin = async function (req, res, next) {
  const {token} = req.headers;

  const val = validatePermissions.validate({
    token
  }, { context: { function: 'isAdmin' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  if (await admin(token)) return next();
  else return res.status(401).end();
}

/**
 * @description This function authenticates an auditor user.
 * @returns next() or 401 status.
 */
const isAuditor = async function (req, res, next) {
  const {token} = req.headers;

  const val = validatePermissions.validate({
    token
  }, { context: { function: 'isAuditor' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  if (await auditor(token)) return next();
  else return res.status(401).end();
}

/**
 * @description This function authenticates an common user.
 * @returns next() or 401 status.
 */
const isCommon = async function (req, res, next) {
  const {token} = req.headers;

  const val = validatePermissions.validate({
    token
  }, { context: { function: 'isCommon' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  if (await common(token)) return next();
  else return res.status(401).end();
}

/**
 * @description This function authenticates an public agency user.
 * @returns next() or 401 status.
 */
const isPublicAgency = async function (req, res, next) {
  const {token} = req.headers;

  const val = validatePermissions.validate({
    token
  }, { context: { function: 'isPublicAgency' } });
  
  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  if (await publicAgency(token)) return next();
  else return res.status(401).end();
}

/**
 * @description This function authenticates a specific user.
 * @returns next() or 401 status.
 */
const isHimself = async function (req, res, next) {
  const {token} = req.headers;
  const {email} = req.params;

  const val = validatePermissions.validate({
    token,  
    email
  }, { context: { function: 'isHimself' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  if (await himself(token, email)) return next();
  else return res.status(401).end();
}

/**
 * @description This function authenticates an administrator user or a specific user.
 * @returns next() or 401 status.
 */
const isHimselfOrAdmin = async function (req, res, next) {
  const {token} = req.headers;
  const {email} = req.params;

  const val = validatePermissions.validate({
    token,  
    email
  }, { context: { function: 'isHimselfOrAdmin' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  if (await himself(token, email) || await admin(token)) return next();
  else return res.status(401).end();
}

/**
 * @description This function authenticates a owner of comment.
 * @returns next() or 401 status.
 */
const isMyComment = async function (req, res, next) {
  const {token} = req.headers;
  const {id} = req.params;      // route delete comment
  const {comment} = req.body;   // route removeComment for denunciation
  
  var compare = id;
  if (comment) compare = comment;

  const val = validatePermissions.validate({
    token,  
    id
  }, { context: { function: 'isMyComment' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  if (await myComment(token, compare)) return next();
  else return res.status(401).end();
}

/**
 * @description This function authenticates a owner of comment.
 * @returns next() or 401 status.
 */
 const canRemoveComment = async function (req, res, next) {
  const {token} = req.headers;
  const {id} = req.params;
  const {comment} = req.body;
  
  const val = validatePermissions.validate({
    token,  
    id,
    comment
  }, { context: { function: 'canRemoveComment' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  if (await myComment(token, comment) || await myDenunciation(token, id) || auditor(token)) return next();
  else return res.status(401).end();
}

/**
 * @description This function authenticates a owner of denunciation.
 * @returns next() or 401 status.
 */
const isMyDenunciation = async function (req, res, next) {
  const {token} = req.headers;
  const {id} = req.params;

  const val = validatePermissions.validate({
    token,  
    id
  }, { context: { function: 'isMyDenunciation' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  if (await myDenunciation(token, id)) return next();
  else return res.status(401).end();
}

module.exports = {
  isUser,
  isAdmin,
  isAuditor,
  isCommon,
  isPublicAgency,
  isHimself,
  isHimselfOrAdmin,
  isMyComment,
  canRemoveComment,
  isMyDenunciation
}