const Businesses = require('../models/businesses');
// const config = require('../config');
const mongoose = require('mongoose');

// Add reservations and remove reservations
function Reservations () {

	this.getAllReservationsFromYelpCall = function (req, res) {
    if (!req.body) return;
		var businessIDs = req.body.ids  //this is an array [id, id, id..]
		var arr = businessIDs.map(function(val) {
			return (val)
		})

		Businesses.find({
			'id': { $in: arr}
		}, function(err, docs){
				console.log(docs)
				res.json(docs)
		});
	}

//TODO - possible remove as it is currently unused
	this.getReservations = function (req, res) {
    console.log('Get reservation')
		var businessId = req.query.id;
		Businesses.findOne({ 'id': businessId }, function (err, business) {
				
			if (err) {
							console.log("An error occurred", err);
							res.json({error: "An error occurred"});
			}
			res.json(business);

		});	
	
	};

	this.addReservation = function (req, res) {

	    var businessId = req.body.id;
				    
		  //add reservation for the business venue
		 Businesses.findOneAndUpdate(
			{ 'id':  businessId },
			{ $addToSet: { 'user_reservations': {'_id': mongoose.Types.ObjectId(req.user._id), 'email':req.user.email, 'firstname': req.user.firstname, 'lastname': req.user.lastname}  }},
			{ 'new': true, 'upsert': true}
			)
			.exec(function (err, result) {
					if (err) { 
                		console.log("Error occurred", err);
                		res.json({error: "Error occurred"});
					}
				
					res.json(result);
				}
			);
	    
	};

	this.removeReservation = function (req, res) {
	    
		var businessId = req.body.id;
		Businesses.findOneAndUpdate(
            			{ 'id':  businessId },
            			{ $pull: { 'user_reservations': mongoose.Types.ObjectId(req.user._id)  }},
            			{ 'new': true}
            			)
            			.exec(function (err, result) {
            					if (err) { 
                            		console.log("An error occurred", err);
                            		res.json({error: "An error occurred"});
            					}
            				
            					res.json(result);
            				}
            			);

	};

}

module.exports = Reservations;
