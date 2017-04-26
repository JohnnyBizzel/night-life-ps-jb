var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Business = new Schema({
    id: String,
    user_reservations: [
        {_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserSchema',
            unique: true
        },
        email: String,
        firstname: String,
        lastname: String
    }]
});

module.exports = mongoose.model('business', Business);