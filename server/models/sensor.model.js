const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const recordSchema = new mongoose.Schema({
  id: String,
  cycle: Number,
  setting1: Number,
  setting2: Number,
  setting3: Number,
  s1: Number,
  s2: Number,
  s3: Number,
  s4: Number,
  s5: Number,
  s6: Number,
  s7: Number,
  s8: Number,
  s9: Number,
  s10: Number,
  s11: Number,
  s12: Number,
  s13: Number,
  s14: Number,
  s15: Number,
  s16: Number,
  s17: Number,
  s18: Number,
  s19: Number,
  s20: Number,
  s21: Number,
  seq: { // New field for auto-increment
    type: Number,
    unique: true
  }
});

// Apply the plugin to your schema
recordSchema.plugin(AutoIncrement, { inc_field: 'seq' });

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
