const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let RoomModel = {};

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});