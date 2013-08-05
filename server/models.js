var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    userRoles = require('./routingConfig').userRoles;

mongoose.connect('mongodb://localhost/test');

/** USER **/
var UserSchema = new Schema({
  name: {type : String, required : true},
  email: {type : String, required : true, unique: true},
  password: {type : String, required : true}, // A password of '!' means unregistered user
  role: {type : Number, required : true},
  tables: [{type: Schema.Types.ObjectId, ref: 'Table'}],
  currentTable: {type: Schema.Types.ObjectId, ref: 'Table'}
});

/*
UserSchema.pre("save",function(next) {
  var self = this;
  exports.Users.findOne({email : self.email},function(err, results) {
    if(err) {
      next(err);
    } else if(results) { //there was a result found, so the email address exists
      next(new Error("email must be unique"));
    } else {
      next();
    }
  });
});
*/

/** TRANSACTION **/
var TransactionSchema = new Schema({
  owner: {type: Schema.Types.ObjectId, ref: 'Users', required : true},
  split: [{type: Schema.Types.ObjectId, ref: 'Users', required : true}],
  title: {type : String, required : true},
  description: String,
  amount: {type : Number, required : true},
  date: { type: Date, default: Date.now }
});

/** TABLE **/
var TableSchema = new Schema({
  title: {type : String, required : true},
  members: [{type: Schema.Types.ObjectId, ref: 'Users'}],
  transactions: [TransactionSchema],
  prevTables: [TableSchema]
});


exports.Users = mongoose.model('Users',UserSchema);
exports.Transactions = mongoose.model('Transactions',TransactionSchema);
exports.Tables = mongoose.model('Tables',TableSchema);
