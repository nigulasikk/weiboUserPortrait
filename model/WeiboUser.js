var mongoose = require('mongoose');
var db = mongoose.connection;

mongoose.connect('mongodb://localhost/test', { useMongoClient: true });
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log(' mongo connected! open!')
});
var weiboUserSchema = mongoose.Schema({
    name: String,
    intro: String,
    photo: String,
    follows: String,
    fans: String,
    weibos: String
});

var weiboUser = mongoose.model('weiboUser', weiboUserSchema);

module.exports = weiboUser;