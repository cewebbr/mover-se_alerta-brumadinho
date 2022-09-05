const Comments = require('../models/comment');
const {validateComment} = require('../validation/comment');
const {getUser} = require('./utils');

/**
 * @description This function returns a comment's data.
 * @returns List comment's data or error the status. 
 */
 const get = async function (req, res) {
  const {id} = req.params;

  const val = validateComment.validate({id}, { context: { function: 'get' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  try {
    var comment = await Comments.findOne({_id: id});
  } catch (err) {
    if (err) return res.status(500).send({error: "Error fetching comment!"});
  }

  if (!comment) return res.status(400).send({error: 'Unregistered id!'});

  return res.status(200).send(comment);
}


/**
 * @description This function returns the list of users who liked the comment.
 * @returns Users list or error status.
 */
 const getLikes = async function (req, res) {
  const {id} = req.params;

  const val = validateComment.validate({id}, { context: { function: 'getLikes' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validate id
  try {
    var comment = await Comments.findOne({_id: id})
    .populate('likes', 'name').select('likes');

    if(!comment) return res.status(400).send({error: 'Unregistered comment!'});
  } catch (err) {
    if (err) return res.status(500).send({error: "Error fetching comment!"});
  }

  return res.status(200).send(comment.likes);

}

/**
 * @description This function creates a new comment in the database.
 * @returns The created comment or the error status.
 */
const add = async function (req, res) {
  const { token } = req.headers;

  const {
    description
  } = req.body;

  const val = validateComment.validate({
    token,
    description
  }, { context: { function: 'add' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validating publisher
  const user = await getUser(token);

  if(!user) res.status(400).send({error: 'Invalid token!'});

  const user_type = (user.type == 'agency' ? 'PublicAgency' : 'Resident');
  
  try {
    const comment = await Comments.create({
      userType: user_type,
      publisher: user._id,
      description: description,
    });
    return res.status(201).send(comment);

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error creating comment!'});
  }
}

/**
 * @description This function modifies the data of a specific comment.
 * @returns Operation status.
 */
const update = async function (req, res) {
  const { id } = req.params;

  const { description } = req.body;

  const val = validateComment.validate({
    id,  
    description
  }, { context: { function: 'update' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validating comment
  try {
    var comment = await Comments.findOne({_id: id});
    if (!comment) return res.status(400).send({error: 'Unregistered comment!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching comment!'});
  }

  try {
    const ret = await comment.updateOne({description: description});
    if (ret) return res.status(200).send({ret});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error updating comment!'});
  }

}

/**
 * @description This function adds a like to the comment.
 * @returns Comment or the error status.
 */
const like = async function (req, res) {
  const { id } = req.params;
  const { token } = req.headers;

  const val = validateComment.validate({
    id,  
    token
  }, { context: { function: 'like' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validate comment
  try {
    var comment = await Comments.findOne({_id: id});
    if (!comment) return res.status(400).send({error: 'Unregistered comment!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching comment!'});
  }

  // Validate user
  const user = await getUser(token);

  if(!user) res.status(400).send({error: 'Invalid token!'});

  // User already liked?
  if (comment.likes.includes(user.id)) return res.status(400).send({error: 'User already liked!'});

  // Like
  try {
    await comment.updateOne({$push:{ likes: user.id }});
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error like comment!'});
  }

  // Return comment
  try {
    comment = await Comments.findOne({_id: id}).populate('publisher', '_id name photo');

    return res.status(200).send(comment);
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching comment!'});
  }
}

/**
 * @description This function removes the comment's like.
 * @returns Comment or the error status.
 */
const removeLike = async function (req, res) {
  const { id } = req.params;
  const { token } = req.headers;

  const val = validateComment.validate({
    id,  
    token
  }, { context: { function: 'removeLike' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validate comment
  try {
    var comment = await Comments.findOne({_id: id});
    if (!comment) return res.status(400).send({error: 'Unregistered comment!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching comment!'});
  }

  // Validate user
  const user = await getUser(token);

  if(!user) res.status(400).send({error: 'Invalid token!'});

  // User already liked?
  if (!(comment.likes.includes(user.id))) return res.status(400).send({error: 'User did not liked!'});

  // Remove like
  try {
    await comment.updateOne({$pull:{ likes: user.id }});
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error to dislike comment!'});
  }

  // Return comment
  try {
    comment = await Comments.findOne({_id: id}).populate('publisher', '_id name photo');

    return res.status(200).send(comment);
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching comment!'});
  }
}

/**
 * @description This function deletes a comment.
 * @returns Operation status.
 */
const removeComment = async function (req, res) {
  const { id } = req.params;

  const val = validateComment.validate({id}, { context: { function: 'removeComment' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validating unique data
  try {
    if (!(await Comments.findOne({_id: id}))) 
      return res.status(400).send({error: 'Unregistered comment!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching comment!'});
  }

  // Deleting
  try {
    await Comments.deleteOne({_id: id});
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error deleting comment!'});
  }

  // Confirm operation
  try {
    if (!(await Comments.findOne({_id: id}))) 
      return res.status(200).send({message: 'Comment successfully deleted'});

    return res.status(500).send({error: 'Error deleting comment!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching comment!'});
  }

}

module.exports = {
  get,
  getLikes,
  add, 
  update,
  like,
  removeLike,
  removeComment
};