const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const ResidentSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['common', 'auditor', 'admin'],
    default: 'common'
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  birth: {
    type: Date,
    required: true
  },
  uf: {
    type: String,
    required: true,
    default: "MG"
  },
  city: { 
    type: String,
    required: true,
    default: "Brumadinho"
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  photo: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

/**
 * @description This function encrypts the resident password as soon as the "password" attribute is modified.
 */
ResidentSchema.pre('save', async function (next) {
  let resident = this;
  if (!resident.isModified('password')) return next();

  resident.password = await bcrypt.hash(resident.password, 10);

  return next();
});

ResidentSchema.statics.paginateSort = async function (condition, visibility, sortBased, order, lastValue, lastId, callback) {

  var matchObj = condition == {} ? undefined : condition;

  var sortObj = { [sortBased]: parseInt(order), "_id": parseInt(order) };
  
  var sortOperator = (parseInt(order) == 1 ? '$gt' : '$lt');

  var lastValueConvert = (sortBased == "name" ? lastValue : new Date(lastValue));

  var projectObj = (visibility == "public" ? {
    "_id": 1,
    "name": 1,
    "email": 1,
    "uf": 1,
    "city": 1,
    "photo": 1,
    "created": 1
  } : {
    "_id": 1,
    "type": 1,
    "name": 1,
    "email": 1,
    "birth": 1,
    "uf": 1,
    "city": 1,
    "photo": 1,
    "created": 1
  })

  if (lastValue != undefined) {
    if (condition != {}) {
      matchObj = {
        $and: [
          { $and: [condition] },
          { $or: [
            { [sortBased]: { [sortOperator]: lastValueConvert } },
            { [sortBased]: lastValueConvert,
              "_id": { [sortOperator]: mongoose.Types.ObjectId(lastId) }
      }]}]}
    } else {
      matchObj = {
        $or: [
        { [sortBased]: { [sortOperator]: lastValueConvert } },
        { [sortBased]: lastValueConvert,
          "_id": { [sortOperator]: mongoose.Types.ObjectId(lastId) }
      }]}
    }
  }

  try {
    var residents = await this.aggregate([
      {"$project": projectObj},
      {"$sort": sortObj},
      {"$match": matchObj},
      {"$limit": parseInt(process.env.LIMIT_PER_PAGE)}
    ])

  } catch (err) {
    if (err) return callback ("Error fetching residents!", null);
  }

  return callback (null, residents)

}

module.exports = mongoose.model('Resident', ResidentSchema);
