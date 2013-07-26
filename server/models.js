var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    userRoles = require('./routingConfig').userRoles;

mongoose.connect('mongodb://localhost/test');

var UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  role: Number
});

exports.Users = mongoose.model('Users',UserSchema);

var TransactionSchema = new Schema({
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  split: [{type: Schema.Types.ObjectId, ref: 'User'}],
  title: String,
  description: String,
  amount: Number
});

exports.Transaction = mongoose.model('Transaction',TransactionSchema);

var TableSchema = new Schema({
  name: String,
  members: [{type: Schema.Types.ObjectId, ref: 'User'}],
  transactions: [TransactionSchema],
  prevTables: [TableSchema]
});

exports.Table = mongoose.model('Table',TableSchema);
