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
		var businessId = req.query.id;
		Businesses.findOne({ 'id': businessId }, function (err, business) {				
			if (err) {
							console.log("An error occurred", err);
							res.json({error: "An error occurred"});
			}
			res.json(business);
		});	
	};

	this.addReservation = function (req, res, err) {
    console.log('API add reservatoin:');
    // TODO:::: cant find body ID - change to GET request with Qry
	  var businessId = req.query.id;
    if (!req.user) throw err;
// Note: When using userID as mongo id it was giving duplicate key errors.
    
    //add reservation for the business venue using the logged in users detail which
    // is in the request object
		 Businesses.findOneAndUpdate(
		 { 'id':  businessId },
		 { $addToSet: { 'user_reservations': { 
		 'email':req.user.email, 
		 'firstname': req.user.firstname, 
		 'lastname': req.user.lastname}  
		 }
		 },
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

  this.updateReservation = function (req, res) {
	    // mongoose.Types.ObjectId(req.user._id)  changed to use email
		var businessId = req.body.id;
    var usrRsvps = req.body.rsvps;
    console.log('API update - new rsvps..', req.body.rsvps)
    let countReservations = 0;
    
		Businesses.findOneAndUpdate(
      { 'id':  businessId },
      { $set: { 'user_reservations': req.body.rsvps }},
      { 'new': true}
		)
		.exec(function (err, result) {
      if (err) { 
          console.log("An error occurred", err);
          res.json({error: "An error occurred updating RSVPs"});
        }            				
        res.json(result);
      }
		);
	};
  
	this.removeReservation = function (req, res) {
	    // mongoose.Types.ObjectId(req.user._id)  changed to use email
		var businessId = req.body.id;
    let countReservations = 0;
    console.log('remove...', req.body.id);
    /// An error occurred TypeError: Cannot use 'in' operator to search for '_id' in april@may.us
    // so ... find the correct business - if no reservations will be left, delete it.
	
    
    Businesses.deleteOne({ 'id':  businessId })
                                      .exec(function (err, result) {
                                                      if (err) { 
                                                          console.log("An error occurred", err);
                                                          res.json({error: "An error occurred removing reservation"});
                                                      }            				
                                                      res.json(result);
                                            })
	};

}

module.exports = Reservations;