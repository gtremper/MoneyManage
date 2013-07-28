var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    userRoles = require('./routingConfig').userRoles;

mongoose.connect('mongodb://localhost/test');

/** USER **/
var UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  role: Number,
  tables: [{type: Schema.Types.ObjectId, ref: 'Table'}],
  currentTable: {type: Schema.Types.ObjectId, ref: 'Table'}
});

/** TRANSACTION **/
var TransactionSchema = new Schema({
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  split: [{type: Schema.Types.ObjectId, ref: 'User'}],
  title: String,
  description: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

/** TABLE **/
var TableSchema = new Schema({
  title: String,
  members: [{type: Schema.Types.ObjectId, ref: 'User'}],
  transactions: [TransactionSchema],
  prevTables: [TableSchema]
});


exports.Users = mongoose.model('Users',UserSchema);
exports.Transactions = mongoose.model('Transactions',TransactionSchema);
exports.Tables = mongoose.model('Tables',TableSchema);
