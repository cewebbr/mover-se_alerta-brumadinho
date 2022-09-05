const PublicAgencies = require('../models/publicAgency');
const Residents = require('../models/resident');
const { 
  createToken,
  isCnpj,
} = require('./utils');
const sendEmail = require('./sendEmail');
const {validateAgency} = require('../validation/publicAgency');
const bcrypt = require('bcrypt');

/**
 * @description This function returns a list of all registered public agencies.
 * @returns Maps data from public agencies, or returns error status 
 */
const list = async function (req, res) {

  const {
    sortBased,
    order,
    lastValue,
    lastId
  } = req.params;

  const val = validateAgency.validate({
    sortBased,
    order,
    lastValue,
    lastId
  }, { context: { function: 'list' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  try {
    await PublicAgencies.paginateSort(
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
    if (err) return res.status(500).send({error: 'Error fetching agency!'});
  }
}

/**
 * @description This function returns a list of all registered public agencies and their public data.
 * @returns Maps public data from public agencies, or returns error status 
 */
 const listPublic = async function (req, res) {
  const {
    sortBased,
    order,
    lastValue,
    lastId
  } = req.params;

  const val = validateAgency.validate({
    sortBased,
    order,
    lastValue,
    lastId
  }, { context: { function: 'listPublic' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  try {
    await PublicAgencies.paginateSort(
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
    if (err) return res.status(500).send({error: 'Error fetching agency!'});
  }
}

/**
 * @description This function returns a public agency's data from their email.
 * @returns Maps data from public agency, or returns error status 
 */
const get = async function (req, res) {
  const {email} = req.params;

  const val = validateAgency.validate({
    email
  }, { context: { function: 'get' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});
  
  try {
    await PublicAgencies.paginateSort(
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
    if (err) return res.status(500).send({error: 'Error fetching agency!'});
  }
}

/**
 * @description This function returns the public data of a public agency from his email.
 * @returns Maps public data from public agency, or returns error status 
 */
const getPublic = async function (req, res) {
  const {email} = req.params;

  const val = validateAgency.validate({
    email
  }, { context: { function: 'getPublic' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  try {
    await PublicAgencies.paginateSort(
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
    if (err) return res.status(500).send({error: 'Error fetching agency!'});
  }
}

/**
 * @description This function returns a agency's data by their verification.
 * @returns Maps agency's public data, or error status 
 */
const getFromVerification = async function (req, res) {
  const {
    verification,
    sortBased,
    order,
    lastValue,
    lastId
  } = req.params;

  const val = validateAgency.validate({
    verification,
    sortBased,
    order,
    lastValue,
    lastId
  }, { context: { function: 'getFromVerification' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  try {
    await PublicAgencies.paginateSort(
      {verification: verification},
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
    if (err) return res.status(500).send({error: 'Error fetching agency!'});
  }
}

/**
 * @description Given a public agency, this function creates a new public agency in the database.
 * @returns {(public agency | null)} Returns the created public agency or the error status.
 */
const add = async function (req, res) {
  var {
    name,
    cnpj,         
    phone,     
    email,
    // uf,               
    // city,
    password,
    photo
  } = req.body;

  const val = validateAgency.validate({
    name,
    cnpj,         
    phone,     
    email,
    // uf,               
    // city,
    password,
    photo
  }, { context: { function: 'add' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validating unique data
  try {
    // if (await !isCnpj(cnpj)) return res.status(400).send({error: 'Invalid cnpj!'});
      
    if (await PublicAgencies.findOne({cnpj})) 
      return res.status(400).send({error: 'This cnpj already belongs to another account!'});

    if ((await PublicAgencies.findOne({email})) || (await Residents.findOne({email})))
      return res.status(400).send({error: 'This public agency email already belongs to another account!'});
    
    if ((await PublicAgencies.findOne({phone})) || (await Residents.findOne({phone}))) 
      return res.status(400).send({error: 'This phone number already belongs to another account!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching public agency!'});
  }

  // perfil photo
  (!photo ? photo = 'N/A' : '');
  
  try {
    const agency = await PublicAgencies.create({
      name:         name,
      cnpj:         cnpj,         
      phone:        phone,     
      email:        email,            
      // uf:           uf,               
      // city:         city,
      password:     password,
      photo:        photo,
    });

    sendEmail.sendEmailAgencyCreated({}, function(err) {});

    agency.password = undefined;
    return res.status(201).send({agency, token: createToken(agency.id)});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error creating public agency!'});
  }
}

/**
 * @description This function allows an administrator to modify the data of a specific public agency according to his email.
 * @returns Returns the modified public agency instance or the error status.
 */
const updateAdmin = async function (req, res) {
  const {email} = req.params;

  var {
    verification
  } = req.body; 

  const val = validateAgency.validate({
    email,         
    verification,     
  }, { context: { function: 'updateAdmin' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validating unique data
  try {
    var agency = await PublicAgencies.findOne({email});
    if (!agency) return res.status(400).send({error: 'Unregistered email!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching public agency!'});
  }

  try {
    await agency.updateOne({verification: verification});
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error updating public agency!'});
  }

  // Return agency
  try {
    await PublicAgencies.paginateSort(
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
    if (err) return res.status(500).send({error: 'Error fetching agency!'});
  }
}

/**
 * @description This function modifies the data of a specific public agency according to his email.
 * @returns Returns the modified public agency instance or the error status.
 */
const updatePublicAgency = async function (req, res) {
  const {email} = req.params;

  var {
    name,
    phone, 
    cnpj,    
    // uf,               
    // city,
    password,
    photo
  } = req.body; 

  const val = validateAgency.validate({
    email,
    cnpj,
    name,
    phone,     
    // uf,               
    // city,
    password,
    photo   
  }, { context: { function: 'updatePublicAgency' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validating unique data
  try {
    var agency = await PublicAgencies.findOne({email});
    if (!agency) return res.status(400).send({error: 'Unregistered email!'});

    if (cnpj && cnpj != agency.cnpj) {
      if ((await PublicAgencies.findOne({cnpj})))
        return res.status(400).send({error: 'This public agency cnpj already belongs to another account!'});
    }
    if (phone && phone != agency.phone) {
      if ((await PublicAgencies.findOne({phone})) || (await Residents.findOne({phone})))
        return res.status(400).send({error: 'This phone number already belongs to another account!'});
    }

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching public agency!'});
  }

  if (password) password = await bcrypt.hash(password, 10);

  const obj = {
    ...(name        !== undefined ? { name } :  {}),
    ...(phone       !== undefined ? { phone } : {}),
    ...(cnpj        !== undefined ? { cnpj } : {}),
    // ...(uf          !== undefined ? { uf } : {}),
    // ...(city        !== undefined ? { city } : {}),
    ...(password    !== undefined ? { password } : {}),
    ...(photo       !== undefined ? { photo } : {}),
  }

  if(Object.keys(obj).length !== 0) {
    try {
      await agency.updateOne(obj);
    } catch (err) {
      if (err) return res.status(500).send({error: 'Error updating public agency!'});
    }

    // Return agency
    try {
      await PublicAgencies.paginateSort(
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
      if (err) return res.status(500).send({error: 'Error fetching agency!'});
    }
  }
}

/**
 * @description This function deletes a public agency according to his email.
 * @returns Returns the deleted public agency or the error status.
 */
const remove = async function (req, res) {
  const {email} = req.params;

  const val = validateAgency.validate({
    email
  }, { context: { function: 'remove' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validating unique data
  try {
    if (!(await PublicAgencies.findOne({email}))) 
      return res.status(400).send({error: 'Unregistered email!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching public agency!'});
  }

  // Deleting
  try {
    await PublicAgencies.deleteOne({email});
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error deleting public agency!'});
  }

  // Confirm operation
  try {
    if (!(await PublicAgencies.findOne({email}))) 
      return res.status(200).send({message: 'Public agency successfully deleted'});

    return res.status(500).send({error: 'Error deleting public agency!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching public agency!'});
  }

}

module.exports = {
  list,
  listPublic,
  get,
  getPublic,
  getFromVerification,
  add,
  updateAdmin,
  updatePublicAgency,
  remove
};
