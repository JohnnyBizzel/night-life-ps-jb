import axios from 'axios';
import config from '../../config'
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_USER,
  FETCH_MESSAGE,
  FETCH_YELP,
  FETCH_RSVP,
  ADD_RSVP,
  DELETE_RSVP,
  FETCH_WHOSGOING,
  SORTED_WHOSGOING
} from './types';

const ROOT_URL = config.url;
const xi = 0;

// This code handles the signin and signup for the redux form
export function handleUserAuthentication(signinType, {email, password, firstname, lastname}) {
    return function(dispatch) {
    // Submit email/password to the server
      console.log('sign in handler: ', signinType);
    return axios.post(`${ROOT_URL}/api/${signinType}`, { email, password, firstname, lastname })
      .then(response => {
        // If request is good...
        // - Update state to indicate user is authenticated
        dispatch({ type: AUTH_USER });
        // - Save the JWT token
        localStorage.setItem('token', response.data.token);
      })
      // If request is bad...
      // - Show an error to the user
      .catch((response) => {
          if (response.status === 400) {
            dispatch(authError('Bad request'))
          } else if (response.status === 401) {
            dispatch(authError('Unauthorized - Bad Login Info'))
          } else {
            dispatch(authError(response.data.error))
          } 
        });

      };
  }

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

export function signoutUser() {
  localStorage.removeItem('token');
  return { type: UNAUTH_USER };
}

export function fetchMessage() {
  return function(dispatch) {
    console.log('MSG: the url found was: ', config.url)
    axios.get(ROOT_URL, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        });
      });
  }
}

export function fetchUser() {
  if (localStorage.getItem('token')) {
    console.log('USR: the url found was: ', config.url)
    const url = `${ROOT_URL}/api/me`

    return function(dispatch) {
      return axios.get(url, {
        headers: { authorization: localStorage.getItem('token') }
      })
        .then(response => {
          dispatch({
            type: FETCH_USER,
            payload: response
          });
        });
      }   
  } else {
    return function(dispatch) {
      dispatch({
        type: FETCH_USER,
        payload: []
      });  
    }
  }

}

export function fetchYelp(city, userid) {
  const url = `${ROOT_URL}/openapi/yelp?location=${city}&userid=${userid}`

    return function(dispatch) {
    return axios.get(url, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({
          type: FETCH_YELP,
          payload: response
        });
      });
  }
}

export function fetchRSVP(businessID) {
  const url = `${ROOT_URL}/api/businesses?id=${businessID}`

    return function(dispatch) {
      return axios.get(url, {
        headers: { authorization: localStorage.getItem('token') }
      })
        .then(response => {
          dispatch({
            type: FETCH_RSVP,
            payload: response
          });
        });
  }
}

export function addRSVP(businessID) {
  const url = `${ROOT_URL}/api/businesses`

  return function(dispatch) {
    return axios.post(url, {id: businessID} , {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({
          type: ADD_RSVP,
          payload: response
        });
      });
  }
}

export function getAllReservationsFromYelpList(ids) {
  const url = `${ROOT_URL}/api/allreservations`

  return function(dispatch) {
    return axios.post(url, {ids: ids} , {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({
          type: FETCH_WHOSGOING,
          payload: response
        });1
      });
  }
}

export function updateReservations(yelpData, whosGoing) {
  
  let arr = []
  let whosGoingArr = whosGoing.concat()
  yelpData.forEach(business =>{
    let newRecord = null
    for(let item of whosGoingArr) {
      if (item.id === business.id) {
        newRecord = item
      } 
    }
    arr.push(newRecord)
  }) 

  return {
    type: SORTED_WHOSGOING,
    payload: arr
  };
}

export function deleteRSVP(businessID) {
  const url = `${ROOT_URL}/api/businesses`

  return function(dispatch) {
    return axios({method: 'delete', url: `${url}`, data: {id: businessID},
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({
          type: DELETE_RSVP,
          payload: response
        });
      });
  }
}