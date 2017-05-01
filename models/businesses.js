var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var customer = mongoose.Schema;

var customer = new Schema({
  email: String,
  firstname: String,
  lastname: String
})
var Business = new Schema({
    id: String,
    user_reservations: [        
      { email: String, firstname: String, lastname: String }       
    ]
});

module.exports = mongoose.model('business', Business);


// {_id: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'UserSchema',
        //     unique: true
        // },