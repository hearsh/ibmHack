const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TrialSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  condition: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  interesteds: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  description: {
    type: String
  },
  moredetaillink: {
    type: String,
    required: true
  },
  inclusion: {
    age: {
      type: Number
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Trial = mongoose.model("trial", TrialSchema);
