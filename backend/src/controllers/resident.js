const Residents = require('../models/resident');
const PublicAgencies = require('../models/publicAgency');
const {
  createToken,
} = require('./utils');
const sendEmail = require('./sendEmail');
const {validateResident} = require('../validation/resident');
const bcrypt = require('bcrypt');

/**
 * @description This function returns a list of all registered residents.
 * @returns Maps residents data, or error status.
 */
const list = async function (req, res) {

  const {
    sortBased,
    order,
    lastValue,
    lastId
  } = req.params;

  const val = validateResident.validate({
    sortBased,
    order,
    lastValue,
    lastId
  }, { context: { function: 'list' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  try {
    await Residents.paginateSort(
      {},
      "private",
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
    if (err) return res.status(500).send({error: 'Error fetching residents!'});
  }
}

/**
 * @description This function returns a list of all registered residents and their public data.
 * @returns Maps residents public data, or error status 
 */
const listPublic = async function (req, res) {
  const {
    sortBased,
    order,
    lastValue,
    lastId
  } = req.params;

  const val = validateResident.validate({
    sortBased,
    order,
    lastValue,
    lastId
  }, { context: { function: 'listPublic' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  try {
    await Residents.paginateSort(
      {},
      "public",
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
    if (err) return res.status(500).send({error: 'Error fetching residents!'});
  }
}

/**
 * @description This function returns a resident's data from their email.
 * @returns Maps resident's public data, or error status 
 */
const get = async function (req, res) {
  const {email} = req.params;

  const val = validateResident.validate({
    email
  }, { context: { function: 'get' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  try {
    await Residents.paginateSort(
      condition = {email: email},
      visibility = "private",
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
    if (err) return res.status(500).send({error: 'Error fetching resident!'});
  }
}

/**
 * @description This function returns the public data of a resident from his email.
 * @returns Maps resident's public data, or error status 
 */
const getPublic = async function (req, res) {
  const {email} = req.params;

  const val = validateResident.validate({
    email
  }, { context: { function: 'getPublic' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  try {
    await Residents.paginateSort(
      condition = {email: email},
      visibility = "public",
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
    if (err) return res.status(500).send({error: 'Error fetching resident!'});
  }
}

/**
 * @description This function returns a resident's data by their type.
 * @returns Maps resident's public data, or error status 
 */
const getFromType = async function (req, res) {
  const {
    type,
    sortBased,
    order,
    lastValue,
    lastId
  } = req.params;

  const val = validateResident.validate({
    type,
    sortBased,
    order,
    lastValue,
    lastId
  }, { context: { function: 'getFromType' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  try {
    await Residents.paginateSort(
      {type: type},
      "private",
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
    if (err) return res.status(500).send({error: 'Error fetching residents!'});
  }
}

/**
 * @description This function creates a new resident in the database.
 * @returns Returns the created resident or the error status.
 */
const add = async function (req, res) {
  var {
    name,
    email,
    birth,
    // uf,
    // city,
    password,
    photo
  } = req.body;

  const val = validateResident.validate({
    name,
    email,
    birth,
    // uf,
    // city,
    password,
    photo
  }, { context: { function: 'add' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validating unique data
  try {
    if ((await Residents.findOne({email})) || (await PublicAgencies.findOne({email})))
      return res.status(400).send({error: 'This email already belongs to another account!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching resident!'});
  }

  // perfil photo
  (!photo ? photo = 'N/A' : '');

  try {
    const resident = await Residents.create({
      name:         name,
      email:        email,
      birth:        birth,
      // uf:           uf,
      // city:         city,
      password:     password,
      photo:        photo,
    });
    resident.password = undefined;
    return res.status(201).send({resident, token: createToken(resident.id)});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error creating resident!'});
  }
}

/**
 * @description This function allows an administrator to modify the data of a specific resident according to his email.
 * @returns Returns the modified resident instance or the error status.
 */
const updateAdmin = async function (req, res) {
  const {email} = req.params;

  var {
    type
  } = req.body; 

  const val = validateResident.validate({
    email,
    type
  }, { context: { function: 'updateAdmin' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validating unique data
  try {
    var resident = await Residents.findOne({email});
    if (!resident) return res.status(400).send({error: 'Unregistered email!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching resident!'});
  }

  try {
    await resident.updateOne({type: type});
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error updating resident!'});
  }

  if (type == "auditor" && resident.type != "auditor") 
    sendEmail.sendEmailYouAreAuditor({resident}, ()=>{})

  // Return resident
  try {
    await Residents.paginateSort(
      condition = {email: email},
      visibility = "public",
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
    if (err) return res.status(500).send({error: 'Error fetching resident!'});
  }
}

/**
 * @description This function modifies the data of a specific resident according to his email.
 * @returns Returns the modified resident instance or the error status.
 */
const updateResident = async function (req, res) {

  const {email} = req.params;

  var {
    name,     
    birth,        
    // uf,               
    // city,
    password,
    photo
  } = req.body;

  const val = validateResident.validate({
    name,     
    email,         
    birth,        
    // uf,               
    // city,
    password,
    photo
  }, { context: { function: 'updateResident' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validating unique data
  try {
    var resident = await Residents.findOne({email});
    if (!resident) return res.status(400).send({error: 'Unregistered email!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching resident!'});
  }

  if (password) password = await bcrypt.hash(password, 10);

  const obj = {
    ...(name        !== undefined ? { name } :  {}),
    ...(birth       !== undefined ? { birth } : {}),
    // ...(uf          !== undefined ? { uf } : {}),
    // ...(city        !== undefined ? { city } : {}),
    ...(password    !== undefined ? { password } : {}),
    ...(photo       !== undefined ? { photo } : {}),
  }

  if(Object.keys(obj).length !== 0) {
    try {
      await resident.updateOne(obj);

    } catch (err) {
      if (err) return res.status(500).send({error: 'Error updating resident!'});
    }

    // Return resident
    try {
      await Residents.paginateSort(
        condition = {email: email},
        visibility = "private",
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
      if (err) return res.status(500).send({error: 'Error fetching resident!'});
    }
  }
}

/**
 * @description This function deletes a resident according to his email.
 * @returns Returns the deleted resident or the error status.
 */
const remove = async function (req, res) {
  const {email} = req.params;

  const val = validateResident.validate({
    email
  }, { context: { function: 'remove' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});
  
  // Validating unique data
  try {
    if (!(await Residents.findOne({email}))) 
      return res.status(400).send({error: 'Unregistered email!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching resident!'});
  }

  // Deleting
  try {
    await Residents.deleteOne({email});
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error deleting resident!'});
  }

  // Confirm operation
  try {
    if (!(await Residents.findOne({email}))) 
      return res.status(200).send({message: 'Resident successfully deleted'});

    return res.status(500).send({error: 'Error deleting resident!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching resident!'});
  }
}

module.exports = {
  list,
  listPublic,
  get,
  getPublic,
  getFromType,
  add,
  updateAdmin,
  updateResident,
  remove
};
