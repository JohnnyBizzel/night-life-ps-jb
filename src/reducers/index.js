import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import authReducer from './auth_reducer';
import yelpReducer from './yelp_reducer';
import rsvpReducer from './rsvp_reducer';
import sampleData from './sampleData_reducer';
import userReducer from './user_reducer';

1
const rootReducer = combineReducers({
  form,
  auth: authReducer,
  yelpListings: yelpReducer,
  rsvp: rsvpReducer,
  sampleData: sampleData,
  user: userReducer,
});

export default rootReducer;
