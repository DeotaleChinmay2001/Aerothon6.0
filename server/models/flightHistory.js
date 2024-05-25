const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const coordinateDetailSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  City: { type: String, required: true },
  Country: { type: String, required: true },
  IATA: { type: String, required: true },
  ICAO: { type: String, required: true },
  Latitude: { type: String, required: true },
  Longitude: { type: String, required: true }
}, { _id: false });

const coordinateSchema = new mongoose.Schema({
  source: { type: coordinateDetailSchema, required: true },
  destination: { type: coordinateDetailSchema, required: true }
}, { _id: false });

const currentLocationSchema = new mongoose.Schema({
  longitude: { type: Number, default: null },
  latitude: { type: Number, default: null }
}, { _id: false });

const sampleSchema = new mongoose.Schema({
  flightId: { type: String, default: uuidv4, unique: true },
  User: { type: String },
  coordinate: { type: coordinateSchema, required: true },
  currentLocation: { type: currentLocationSchema, required: true },
  planePaused: { type: Number, default: 0 },
  status: { type: Number, default: 0 },
  weatherError: { type: Number, default: 0 },
  sensorErrorCount: { type: Number, default: 0 }
});

const flightHistory = mongoose.model('flightHistory', sampleSchema);

module.exports = flightHistory;