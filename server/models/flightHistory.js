const mongoose = require('mongoose');

const coordinateDetailSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  City: {
    type: String,
    required: true
  },
  Country: {
    type: String,
    required: true
  },
  IATA: {
    type: String,
    required: true
  },
  ICAO: {
    type: String,
    required: true
  },
  Latitude: {
    type: String,
    required: true
  },
  Longitude: {
    type: String,
    required: true
  }
}, { _id: false }); // No _id field for embedded document

const coordinateSchema = new mongoose.Schema({
  source: {
    type: coordinateDetailSchema,
    required: true
  },
  destination: {
    type: coordinateDetailSchema,
    required: true
  }
}, { _id: false }); // No _id field for embedded document

const currentLocationSchema = new mongoose.Schema({
  longitude: {
    type: Number,
    default: null
  },
  latitude: {
    type: Number,
    default: null
  }
}, { _id: false }); // No _id field for embedded document

const sampleSchema = new mongoose.Schema({
  coordinate: {
    type: coordinateSchema,
    required: true
  },
  currentLocation: {
    type: currentLocationSchema,
    required: true
  },
  planePaused: {
    type: Number,
    default: 0
  },
  status: {
    type: Number,
    default: 0
  },
  weatherError: {
    type: Number,
    default: 0
  },
  sensorErrorCount: {
    type: Number,
    default: 0
  }
});

const flightHistory = mongoose.model('Sample', sampleSchema);

module.exports = flightHistory;
