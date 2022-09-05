const Categories = require('../models/category');
const {validateCategory} = require('../validation/category');

/**
 * @description This function lists all categories 
 * @returns List the categories or the error status
 */
const list = async function (req, res) {
  try {
    var categories = await Categories.find({});
    
    return res.status(200).json (
      categories.map(el => ({
        id:           el.id,
        name:         el.name,
        description:  el.description,
        created:      el.created,
      })),
    );

  } catch (err) {
    if (err) return res.status(500).send({error: "Error fetching categories!"});
  }
}

/**
 * @description This function returns a category
 * @returns Category data or the error status
 */
const get = async function (req, res) {
  const {id} = req.params;

  const val = validateCategory.validate({id}, { context: { function: 'get' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  try {
    var category = await Categories.findOne({_id: id});
    
    if (!category) return res.status(400).send({error: 'Unregistered category!'});
  
    return res.json({
      id:           category.id,
      name:         category.name,
      description:  category.description,
      created:      category.created,
    });
    
  } catch(err) {
    if (err) return res.status(500).send({error: "Error fetching category!"});
  }
}

/**
 * @description This function creates a new category in the database
 * @returns The created category or the error status
 */
const add = async function (req, res) {
  var {
    name,  
    description
  } = req.body;

  const val = validateCategory.validate({
    name,
    description
  }, { context: { function: 'add' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validating unique data
  try {
    if (await Categories.findOne({name})) 
      return res.status(400).send({error: 'This name already belongs to another category!'});
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching categories!'});
  }

  try {
    const category = await Categories.create({
      name:         name,
      description:  description
    });
    return res.status(201).send({category});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error creating category!'});
  }
}

/**
 * @description This function modifies the data of a category
 * @returns Operation result or the error status
 */
const update = async function (req, res) {
  const {id} = req.params;

  var {
    name,
    description
  } = req.body; 

  const val = validateCategory.validate({
    id,
    name,
    description
  }, { context: { function: 'update' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  // Validating unique data
  try {
    var category = await Categories.findOne({_id: id});
    if (!category) return res.status(400).send({error: 'Unregistered category!'});

    if (name && name != category.name) {
      if (await Categories.findOne({name}))
        return res.status(400).send({error: 'This name already belongs to another category!'});
    }
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching category!'});
  }

  const obj = {
    ...(name        !== undefined ? { name } :  {}),
    ...(description !== undefined ? { description } : {}),
  }

  if(Object.keys(obj).length !== 0) {
    try {
      const ret = await category.updateOne(obj);
      if (ret) return res.status(200).send({ret});

    } catch (err) {
      if (err) return res.status(500).send({error: 'Error updating category!'});
    }
  }
}

/**
 * @description This function deletes a category
 * @returns Returns operation status 
 */
const remove = async function (req, res) {
  const {id} = req.params;

  const val = validateCategory.validate({
    id
  }, { context: { function: 'remove' } });

  if (val.error) return res.status(400).send({error: val.error.details[0].message});

  try {
    if (!(await Categories.findOne({_id: id}))) 
      return res.status(400).send({error: 'Unregistered category!'});
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching category!'});
  }

  // Deleting
  try {
    await Categories.deleteOne({_id: id});
  } catch (err) {
    if (err) return res.status(500).send({error: 'Error deleting category!'});
  }

  // Confirm operation
  try {
    if (!(await Categories.findOne({_id: id}))) 
      return res.status(200).send({message: 'Category successfully deleted'});

    return res.status(500).send({error: 'Error deleting category!'});

  } catch (err) {
    if (err) return res.status(500).send({error: 'Error fetching category!'});
  }
}

module.exports = {
  list,
  get,
  add,
  update,
  remove
};
