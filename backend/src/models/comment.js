const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  userType: {
    type: String,
    enum: ['Resident', 'PublicAgency'],
    required: true
  },
  publisher: {
    type: Schema.Types.ObjectId,
    refPath: 'userType',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: 'Resident',
    required: false
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', CommentSchema);