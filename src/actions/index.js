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
  UPDATE_RSVP,
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
    return axios.post(`${ROOT_URL}/api/${signinType}`, { email, password, firstname, lastname })
      .then(response => {
        // If request is good...
        // - Update state to indicate user is authenticated
        dispatch({ type: AUTH_USER });
        // - Save the JWT token
        localStorage.setItem('token', response.data.token);
      })
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
    console.log('no token')
    return function(dispatch) {
      dispatch({
        type: FETCH_USER, 
        payload: []
      });  
    }
  }

}

// export function fetchYelp(city, userid) {
//   const url = `${ROOT_URL}/openapi/yelp?location=${city}&userid=${userid}`
//     return function(dispatch) {
//     return axios.get(url, {
//       headers: { authorization: localStorage.getItem('token') }
//     })
//       .then(response => {
//         dispatch({
//           type: FETCH_YELP,
//           payload: response
//         });
//       });
//   }
// }

export function fetchYelp(city, userid) {
  const url = `${ROOT_URL}/openapi/yelp?location=${city}&userid=${userid}`
    return function(dispatch) {
    return axios.get(url, {
      headers: { authorization: process.env.YELP_API }
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
  const url = `${ROOT_URL}/api/businessp?id=${businessID}`
// {id: businessID} {"id": `${businessID}`}, 
  return function(dispatch) {
    return axios.get(url,  {
      headers: { 'authorization': localStorage.getItem('token'), 'Content-Type': 'application/json' }
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
      console.log(response);
        dispatch({
          type: FETCH_WHOSGOING,
          payload: response
        });
      });
  }
}

export function updateReservations(yelpData, whosGoing) {
  // creates a sorted list of businesses (null if no one is going)
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


// Changed!! This will remove the business record rather than leaving 
// a record with an empty list of reservations
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

export function removeOneRSVP(businessID, whosGoing) {
  const url = `${ROOT_URL}/api/business`

  return function(dispatch) {
    return axios({method: 'post', 
                  url: `${url}`, 
                  data: {  id: businessID,
                          rsvps: whosGoing },
                  headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({
          type: UPDATE_RSVP,
          payload: response
        });
      });
  }
}