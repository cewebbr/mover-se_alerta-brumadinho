const mongoose = require('mongoose');
const Denunciations = require('../models/denunciation');
const Categories = require('../models/category');
const Residents = require('../models/resident');
const Comments = require('../models/comment');
const {validateDenunciation} = require('../validation/denunciation');
const { 
  getUser,
} = require('./utils');
const sendEmail = require('./sendEmail');
const {generateSearchId} = require('./utils');

/**
 * @description This function returns a list of all registered denunciations.
 * @returns Maps denunciations data, or error status.
 */
const list = async function (req, res) {
  
  const {
    sortBased,
    order,
    lastValue,
    lastId
  } = req.params;

  const val = validateDenunciation.validate({
    sortBased,
    order,
    lastValue,
    lastId
  }, { context: { function: 'list' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  try {
    await Denunciations.paginateSort(
      {},
      sortBased,
      order,
      lastValue,
      lastId,
      function (err, result) {
        if (err) return res.status(500).send({error: err});

        return res.status(200).send(result);
      } 
    );
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching denunciations!'});
  }
}

/**
 * @description This function returns a denunciation's data by their searchId.
 * @returns Maps denunciation's public data, or error status 
 */
const getFromSearchId = async function (req, res) {
  const {
    searchId
  } = req.params;

  const val = validateDenunciation.validate({
    searchId
  }, { context: { function: 'getFromSearchId' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  try {
    await Denunciations.paginateSort(
      condition = {searchId: searchId},
      sortBased = 'created',
      order = '-1',
      lastValue = undefined,
      lastId = undefined,
      function (err, result) {
        if (err) return res.status(500).send({error: err});

        return res.status(200).send(result[0]);
      } 
    );
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching denunciation!'});
  }
}

/**
 * @description This function returns a denunciation's data by their city.
 * @returns Maps denunciation's public data, or error status 
 */
const getFromCity = async function (req, res) {

  const {
    uf,
    city,
    sortBased,
    order,
    lastValue,
    lastId
  } = req.params;

  const val = validateDenunciation.validate({
    uf,
    city,
    sortBased,
    order,
    lastValue,
    lastId
  }, { context: { function: 'getFromCity' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  try {
    await Denunciations.paginateSort(
      {uf: uf, city: city, status: 'accepted'},
      sortBased,
      order,
      lastValue,
      lastId,
      function (err, result) {
        if (err) return res.status(500).send({error: err});

        return res.status(200).send(result);
      } 
    );
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching denunciations!'});
  }
}

/**
 * @description This function returns a denunciation's data by their email.
 * @returns Maps denunciation's public data, or error status 
 */
const getFromEmail = async function (req, res) {

  const {
    email,
    sortBased,
    order,
    lastValue,
    lastId
  } = req.params;

  const val = validateDenunciation.validate({
    email,
    sortBased,
    order,
    lastValue,
    lastId
  }, { context: { function: 'getFromEmail' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validate email
  try {
    var resident = await Residents.findOne({email});
  } catch (err) {
    if (err) return res.status(500).send({error: "Error fetching email owner!"});
  }
  
  if (!resident) return res.status(400).send({error: "Unregistered email!"});

  try {
    await Denunciations.paginateSort(
      {"publisher._id": mongoose.Types.ObjectId(resident.id)},
      sortBased,
      order,
      lastValue,
      lastId, 
      function (err, result) {
        if (err) return res.status(500).send({error: err});

        return res.status(200).send(result);
      } 
    );
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching denunciations!'});
  }
}

/**
 * @description This function returns a denunciation's data by their email and status.
 * @returns Maps denunciation's public data, or error status 
 */
 const getFromEmailAndStatus = async function (req, res) {

  const {
    email,
    status,
    sortBased,
    order,
    lastValue,
    lastId
  } = req.params;

  const val = validateDenunciation.validate({
    email,
    status,
    sortBased,
    order,
    lastValue,
    lastId
  }, { context: { function: 'getFromEmail' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validate email
  try {
    var resident = await Residents.findOne({email});
  } catch (err) {
    if (err) return res.status(500).send({error: "Error fetching email owner!"});
  }
  
  if (!resident) return res.status(400).send({error: "Unregistered email!"});

  try {
    await Denunciations.paginateSort(
      {"publisher._id": mongoose.Types.ObjectId(resident.id), "status": status},
      sortBased,
      order,
      lastValue,
      lastId, 
      function (err, result) {
        if (err) return res.status(500).send({error: err});

        return res.status(200).send(result);
      } 
    );
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching denunciations!'});
  }
}

/**
 * @description This function returns a denunciation's data by their status and city.
 * @returns Maps denunciation's public data, or error status 
 */
const getFromStatusAndCity = async function (req, res) {
  const {
    status,
    uf,
    city,
    sortBased,
    order,
    lastValue,
    lastId
  } = req.params;

  const val = validateDenunciation.validate({
    status,
    uf,
    city,
    sortBased,
    order,
    lastValue,
    lastId
  }, { context: { function: 'getFromSatus' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  try {
    await Denunciations.paginateSort(
      {status: status, uf: uf, city: city},
      sortBased,
      order,
      lastValue,
      lastId,
      function (err, result) {
        if (err) return res.status(500).send({error: err});

        return res.status(200).send(result);
      }
    );
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching denunciations!'});
  }
}

/**
 * @description This function returns the list of users who liked the denunciation.
 * @returns Returns users list or error status.
 */
const getLikes = async function (req, res) {
  const {id} = req.params;

  const val = validateDenunciation.validate({id}, { context: { function: 'getLikes' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validate id
  try {
    var denunciation = await Denunciations.findOne({_id: id})
    .populate('likes', 'name').select('likes');

    if(!denunciation) return res.status(400).send({error: 'Unregistered denunciation!'});
  } catch (err) {
    if (err) return res.status(500).send({error: "Error fetching denunciation!"});
  }

  return res.status(200).send(denunciation.likes);

}

/**
 * @description This function creates a new denunciation in the database.
 * @returns Returns the created denunciation or error status.
 */
const add = async function (req, res) {
  const {token} = req.headers;

  const {
    category,
    title,  
    description,
    anonymous,
    media,
    location,
    // uf,
    // city
  } = req.body;

  const val = validateDenunciation.validate({
    token,
    category,
    title,  
    description,
    anonymous,
    media,
    location,
    // uf,
    // city
  }, { context: { function: 'add' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});
  
  // Validate category
  try {
    if(!(await Categories.findOne({_id: category})))
      return res.status(400).send({error: 'Unregistered category!'});
  } catch (err) {
    if (err) return res.status(500).send({error: "Error fetching category!"});
  }

  var publisher;
  if (token) {
    // Validate publisher
    publisher = await getUser(token);
  
    if(!publisher) res.status(400).send({error: 'Invalid token!'});
  }

  // Generate searchId
  const searchId = await generateSearchId();

  // Get user public ip address
  const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    const denunciation = await Denunciations.create({
      searchId:     searchId,
      category:     category,
      title:        title,
      description:  description,
      anonymous:    anonymous,
      publisher:    publisher,
      media:        media,
      location:     location,
      // uf:           uf,
      // city:         city,
      ip_address:   ip_address
    });

    sendEmail.sendEmailDenunciationCreated({denunciation}, function(err) {});

    publisher ? sendEmail.sendEmailSearchId({publisher, denunciation}, function(err) {}) : '';

    return res.status(201).send(denunciation);

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error creating denunciation!'});
  }
}

/**
 * @description This function adds a comment to the denunciation.
 * @returns Denunciation or the error status.
 */
const comment = async function (req, res) {
  const { token } = req.headers;

  const {id} = req.params;

  const {description} = req.body;

  const val = validateDenunciation.validate({
    id,
    token,
    description
  }, { context: { function: 'comment' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validate denunciation
  try {
    var denunciation = await Denunciations.findOne({_id: id});
    if(!denunciation) return res.status(400).send({error: 'Unregistered denunciation!'});
  } catch (err) {
    if (err) return res.status(500).send({error: "Error fetching denunciation!"});
  }

  // Validating publisher
  const user = await getUser(token);

  if(!user) res.status(400).send({error: 'Invalid token!'});

  const user_type = (user.type == 'agency' ? 'PublicAgency' : 'Resident');

  // Create comment
  try {
    var comment = await Comments.create({
      userType: user_type,
      publisher: user._id,
      description: description,
    });
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error creating comment!'});
  }

  // Add comment to denunciation
  try {
    await denunciation.updateOne({$push:{ comments: comment }});
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error updating denunciation!'});
  }

  if (user.type == 'agency' && denunciation.publisher)
    sendEmail.sendEmailAgencyCommented({denunciation, user}, function(err) {});

  // Return denunciation
  try {
    await Denunciations.paginateSort(
      condition = {"_id": mongoose.Types.ObjectId(id)},
      sortBased = 'created',
      order = '-1',
      lastValue = undefined,
      lastId = undefined,
      function (err, result) {
        if (err) return res.status(500).send({error: err});
  
        return res.status(200).send(result[0]);
      } 
    );
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error return denunciation!'});
  }
}

/**
 * @description this function removes the denunciation's comment.
 * @returns Denunciation or the error status.
 */
 const removeComment = async function (req, res) {
  const { id } = req.params;
  const { comment } = req.body;

  const val = validateDenunciation.validate({
    id,
    comment
  }, { context: { function: 'removeComment' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validate denunciation
  try {
    var denunciation = await Denunciations.findOne({_id: id});
    if (!denunciation) return res.status(400).send({error: 'Unregistered denunciation!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching denunciation!'});
  }

  // Validate comment
   try {
    if(!(await Comments.findOne({_id: comment})))
      return res.status(400).send({error: 'Unregistered comment!'});
  } catch (err) {
    if (err) return res.status(500).send({error: "Error fetching comment!"});
  }

  // Is the comment on the denunciation? 
  if (!(denunciation.comments.includes(comment))) return res.status(400).send({error: 'This comment is not included in the denunciation!'});

  // Removing denunciation comment
  try {
    await denunciation.updateOne({$pull:{ comments: comment }});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error removing denunciation comment !'});
  }

  // Deleting comment
  try {
    await Comments.deleteOne({_id: comment});
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error deleting comment!'});
  }

  // Confirm operation
  try {
    if (await Comments.findOne({_id: comment}))
      return res.status(500).send({error: 'Error deleting comment!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching comment!'});
  }

  // Return denunciation
  try {
    await Denunciations.paginateSort(
      condition = {"_id": mongoose.Types.ObjectId(id)},
      sortBased = 'created',
      order = '-1',
      lastValue = undefined,
      lastId = undefined,
      function (err, result) {
        if (err) return res.status(500).send({error: err});
  
        return res.status(200).send(result[0]);
      } 
    );
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching denunciation!'});
  }
}

/**
 * @description This function adds a like to the denunciation.
 * @returns Denunciation or the error status.
 */
const like = async function (req, res) {
  const { id } = req.params;
  const { token } = req.headers;

  const val = validateDenunciation.validate({
    id,
    token
  }, { context: { function: 'like' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validate denunciation
  try {
    var denunciation = await Denunciations.findOne({_id: id});
    if (!denunciation) return res.status(400).send({error: 'Unregistered denunciation!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching denunciation!'});
  }

  // Validate user
  const user = await getUser(token);

  if(!user) res.status(400).send({error: 'Invalid token!'});

  // User already liked?
  if (denunciation.likes.includes(user.id)) return res.status(400).send({error: 'User already liked!'});

  // Like
  try {
    await denunciation.updateOne({$push:{ likes: user.id }});
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error like denunciation!'});
  }

  // Return denunciation
  try {
    await Denunciations.paginateSort(
      condition = {"_id": mongoose.Types.ObjectId(id)},
      sortBased = 'created',
      order = '-1',
      lastValue = undefined,
      lastId = undefined,
      function (err, result) {
        if (err) return res.status(500).send({error: err});
  
        return res.status(200).send(result[0]);
      } 
    );
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching denunciation!'});
  }
}

/**
 * @description this function removes the denunciation's like.
 * @returns Denunciation or the error status.
 */
const removeLike = async function (req, res) {
  const { id } = req.params;
  const { token } = req.headers;

  const val = validateDenunciation.validate({
    id,
    token
  }, { context: { function: 'removeLike' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validate denunciation
  try {
    var denunciation = await Denunciations.findOne({_id: id});
    if (!denunciation) return res.status(400).send({error: 'Unregistered denunciation!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching denunciation!'});
  }

  // Validate user
  const user = await getUser(token);

  if(!user) res.status(400).send({error: 'Invalid token!'});

  // User already liked?
  if (!(denunciation.likes.includes(user.id))) return res.status(400).send({error: 'User did not liked!'});

  // Remove like
  try {
    await denunciation.updateOne({$pull:{ likes: user.id }});
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error to dislike denunciation!'});
  }

  // Return denunciation
  try {
    await Denunciations.paginateSort(
      condition = {"_id": mongoose.Types.ObjectId(id)},
      sortBased = 'created',
      order = '-1',
      lastValue = undefined,
      lastId = undefined,
      function (err, result) {
        if (err) return res.status(500).send({error: err});
  
        return res.status(200).send(result[0]);
      } 
    );
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error return denunciation!'});
  }
}

/**
 * @description This function allows an auditor to modify the data of a specific denunciation.
 * @returns Denunciation or the error status.
 */
const updateAuditor = async function (req, res) {
  const {id} = req.params;
  const {
    status,
    rejection_reason
  } = req.body;

  const val = validateDenunciation.validate({
    id,
    status,
    rejection_reason
  }, { context: { function: 'updateAuditor' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validate denunciation
  try {
    var denunciation = await Denunciations.findOne({_id: id});
    if (!denunciation) return res.status(400).send({error: 'Unregistered denunciation!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching denunciation!'});
  }

  const obj = {
    ...(status            !== undefined ? { status } :  {}),
    ...(rejection_reason  !== undefined ? { rejection_reason } : {})
  }

  // Update Denunciation
  if(Object.keys(obj).length !== 0) {

    // Update denunciation
    try {
      await denunciation.updateOne(obj);
    } catch (err) {
      if (err) return res.status(500).send({error: 'Error updating denunciation!'});
    }

    // Send Email
    denunciation.publisher ? sendEmail.sendEmailDenunciationValidated({denunciation, status}, function(err) {}) : '';
    
    // Return denunciation
    try {
      await Denunciations.paginateSort(
        condition = {"_id": mongoose.Types.ObjectId(id)},
        sortBased = 'created',
        order = '-1',
        lastValue = undefined,
        lastId = undefined,
        function (err, result) {
          if (err) return res.status(500).send({error: err});
    
          return res.status(200).send(result[0]);
        } 
      );
    } catch (err) {
      if (err) return res.status(500).send({error: 'Error return denunciation!'});
    }
  }
}

/**
 * @description This function modifies the data of a specific denunciation.
 * @returns Denunciation or the error status.
 */
const updatePublisher = async function (req, res) {
  const {id} = req.params;
  
  const {
    category,
    title,
    description,
    anonymous,
    media,
    location,
    // city,
    // uf
  } = req.body;

  const val = validateDenunciation.validate({
    id,
    category,
    title,
    description,
    anonymous,
    media,
    location,
    // city,
    // uf
  }, { context: { function: 'updatePublisher' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validate denunciation
  try {
    var denunciation = await Denunciations.findOne({_id: id});
    if (!denunciation) return res.status(400).send({error: 'Unregistered denunciation!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching denunciation!'});
  }

  const obj = {
    ...(category    !== undefined ? { category } :  {}),
    ...(title       !== undefined ? { title } : {}),
    ...(description !== undefined ? { description } : {}),
    ...(anonymous   !== undefined ? { anonymous } : {}),
    ...(media       !== undefined ? { media } : {}),
    ...(location    !== undefined ? { location } : {}),
    // ...(city        !== undefined ? { city } : {}),
    // ...(uf          !== undefined ? { uf } : {}),
  }

  if(Object.keys(obj).length !== 0) {

    // Update denunciation
    try {
      await denunciation.updateOne(obj);
    } catch (err) {
      if (err) return res.status(500).send({error: 'Error updating denunciation!'});
    }

    // Return denunciation
    try {
      await Denunciations.paginateSort(
        condition = {"_id": mongoose.Types.ObjectId(id)},
        sortBased = 'created',
        order = '-1',
        lastValue = undefined,
        lastId = undefined,
        function (err, result) {
          if (err) return res.status(500).send({error: err});
    
          return res.status(200).send(result[0]);
        } 
      );
    } catch (err) {
      if (err) return res.status(500).send({error: 'Error return denunciation!'});
    }
  }
}

/**
 * @description This function deletes a denunciation.
 * @returns Operation status.
 */
const removeDenunciation = async function (req, res) {
  const {id} = req.params;

  const val = validateDenunciation.validate({id}, { context: { function: 'removeDenunciation' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validating denunciation
  try {
    if (!(await Denunciations.findOne({_id: id}))) 
      return res.status(400).send({error: 'Unregistered denunciation!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching denunciation!'});
  }

  // Deleting
  try {
    await Denunciations.deleteOne({_id: id});
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error deleting denunciation!'});
  }

  // Confirm operation
  try {
    if (!(await Denunciations.findOne({_id: id}))) 
      return res.status(200).send({message: 'Denunciation successfully deleted'});

    return res.status(500).send({error: 'Error deleting denunciation!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching denunciation!'});
  }

}

module.exports = { 
  list,
  getFromSearchId,
  getFromCity,
  getFromEmail,
  getFromStatusAndCity,
  getFromEmailAndStatus,
  getLikes,
  add,
  comment,
  removeComment,
  like,
  removeLike,
  updateAuditor,
  updatePublisher,
  removeDenunciation
};