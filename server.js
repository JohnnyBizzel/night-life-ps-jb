const express = require('express')
const path = require('path')
const port = process.env.PORT || 8080;
const app = express();

const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const Reservation = require('./controllers/reservation_controller')
const reservation = new Reservation();

const yelpResults = require('./controllers/yelp_controller')

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.load();

const userpass = process.env.MONGO_USER + ':' + process.env.MONGO_PWD
const db = mongoose.connect('mongodb://' + userpass + '@ds051893.mlab.com:51893/nitelife-eg');

// App Setup
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' })); // handle json data
app.use(bodyParser.urlencoded({ extended: true })) // handle URL-encoded data

app.use(express.static(__dirname));
// normal routes


  // signin and out
  app.post('/api/signin', requireSignin, Authentication.signin);
  app.post('/api/signup', Authentication.signup);

  //add/remove businesses to user account
  app.get('/api/businessp', requireAuth, reservation.addReservation) 
  app.delete('/api/businesses', requireAuth, reservation.removeReservation) 
  app.get('/api/businesses', requireAuth, reservation.getReservations) 
  app.post('/api/business', requireAuth, reservation.updateReservation) 
  app.post('/api/allreservations', reservation.getAllReservationsFromYelpCall) 

  // access yelp api
  app.get('/openapi/yelp', yelpResults)

  // get current logged in user id
  app.get('/api/me', requireAuth,
    function(req, res, err) {
      if (err) console.log(err);
      console.log(req.user);
      res.json(req.user);
  });

app.get('*', (req,res) => {
res.sendFile(path.resolve(__dirname, 'index.html'))  
});

app.listen(port, function () {
	console.log('Express started on:' + port + ' [Ctl-C] to terminate');
});