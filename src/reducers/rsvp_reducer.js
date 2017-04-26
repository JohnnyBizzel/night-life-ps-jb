import { FETCH_RSVP, ADD_RSVP, FETCH_WHOSGOING, SORTED_WHOSGOING } from '../actions/types'

export default function(state={}, action) {
  switch (action.type) {
    case FETCH_RSVP: 
      let newState = new Object
      newState = Object.assign({},state); 
      newState.fetch = action.payload.data;
      return newState;
    case ADD_RSVP: 
      let newState2 = new Object
      newState2 = Object.assign({},state); 
      newState2.whosGoing.push(action.payload.data);
      return newState2;
      //return { add: action.payload.data, ...state }
    case FETCH_WHOSGOING:      
      let newState3 = new Object
      newState3 = Object.assign({},state); 
      if (action.payload.data){
        newState3.whosGoing = action.payload.data;
      }
        
      return newState3;
      // return [ ...state, {whosGoing: action.payload.data} ]
    case SORTED_WHOSGOING: 
      let newState4 = new Object
      newState4 = Object.assign({},state); 
      newState4.sortedWhosGoing = action.payload;
      return newState4;
      // return { ...state, sortedWhosGoing: action.payload  }
  }
  return state;
}
