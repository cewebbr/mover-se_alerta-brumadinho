const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DenunciationSchema = new Schema({
  searchId: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  title: {
    type: String,
    required: true
  }, 
  description: {
    type: String,
    required: true
  },
  anonymous: {
    type: Boolean,
    required: true
  },
  publisher: {
    type: Schema.Types.ObjectId,
    ref: 'Resident',
    required: false
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: 'Resident',
    required: false
  },
  comments: {
    type: [Schema.Types.ObjectId],
    ref: 'Comment',
    required: false
  },
  media: {
    type: [String],
    required: false
  },
  status: {
    type: String,
    enum: ['unverified', 'accepted', 'rejected'],
    default: 'unverified',
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },
  city: {
    type: String,
    required: true,
    default: 'Brumadinho'
  },
  uf: {
    type: String,
    required: true,
    default: 'MG'
  },
  ip_address: {
    type: String,
    required: true,
    select: false
  },
  rejection_reason: {
    type: String,
    // enum: ['1', '2', '3', '4'],
    required: false
  },
  created: {
    type: Date,
    default: Date.now
  }
});

DenunciationSchema.statics.paginateSort = async function (condition, sortBased, order, lastValue, lastId, callback) {

  var matchObj = condition == {} ? undefined : condition;

  var sortObj = { [sortBased]: parseInt(order), "_id": parseInt(order) };
  
  var sortOperator = (parseInt(order) == 1 ? '$gt' : '$lt');

  var relevanceCalc = (sortBased == "relevance" ? { "$sum": [{ "$size": "$likes" }, { "$size": "$comments" }] } : undefined);

  var lastValueConvert = (sortBased == "relevance" ? parseInt(lastValue) : new Date(lastValue));

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
    var denunciations = await this.aggregate([
      {$lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category'
      }},
      { $unwind: "$category" },
      // Populate Publisher
      {$lookup: {
        from: 'residents',
        localField: 'publisher',
        foreignField: '_id',
        as: 'publisher'
      }},
      {$unwind: {
        path: "$publisher",
        "preserveNullAndEmptyArrays": true
      }},
      // Populate Comments
      {$lookup: {
        from: 'comments',
        let: { "comments": "$comments" },
        pipeline: [
          {"$match": { "$expr": { "$and": [
            { "$in": [ "$_id", "$$comments" ] }, { $eq: [ "$userType", "Resident" ]}]}}},
          // Populate Comments.publisher (Residents)
          {$lookup: {
            from: 'residents',
            localField: 'publisher',
            foreignField: '_id',
            as: 'publisher'
          }},
          {$unwind: {
            path: "$publisher",
            "preserveNullAndEmptyArrays": true
          }}
        ],
        as: 'residentsComments'
      }},
      {$lookup: {
        from: 'comments',
        let: { "comments": "$comments" },
        pipeline: [
          {"$match": { "$expr": { "$and": [
            { "$in": [ "$_id", "$$comments" ] }, { $eq: [ "$userType", "PublicAgency" ]}]}}},
          // Populate Comments.publisher (Agencies)
          {$lookup: {
            from: 'publicagencies',
            localField: 'publisher',
            foreignField: '_id',
            as: 'publisher'
          }},
          {$unwind: {
            path: "$publisher",
            "preserveNullAndEmptyArrays": true
          }}
        ],
        as: 'publicAgenciesComments'
      }},
      {"$project": {
        "category": {_id: 1, name: 1, description: 1},
        "title": 1,
        "description": 1,
        "publisher": {
          $cond: [ {$eq: ["$anonymous", false]}, {
            _id: '$publisher._id', 
            name: '$publisher.name', 
            photo: '$publisher.photo'}, ''
        ]},
        "residentsComments": {_id: 1, description: 1, likes: 1, userType: 1, created: 1, publisher: {_id: 1, name: 1, photo: 1}},
        "publicAgenciesComments": {_id: 1, description: 1, likes: 1, userType: 1, created: 1, publisher: {_id: 1, name: 1, photo: 1}},
        "likes": 1,
        "status": 1,
        "anonymous": 1,
        "media": 1,
        "location": 1,
        "uf": 1,
        "city": 1,
        "rejection_reason": 1,
        "created": 1,
        "relevance": relevanceCalc,
        "searchId": 1
      }},
      {"$sort": sortObj},
      {"$match": matchObj},
      {"$limit": parseInt(process.env.LIMIT_PER_PAGE)},
      {"$project": {"searchId": 0 }},
    ])

  } catch (err) {
    if (err) return callback ("Error fetching denunciations!", null);
  }

  return callback (null, denunciations)

}

module.exports = mongoose.model('Denunciation', DenunciationSchema);