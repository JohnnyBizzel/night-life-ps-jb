import { FETCH_YELP } from '../actions/types'

export default function(state=[], action) {
  switch (action.type) {
    case FETCH_YELP: 
      // let newState = new Object
      // newState = Object.assign({},state); 
      // if (action.payload.data){
      //   newState3.whosGoing = action.payload.data;
      // }
      return [ action.payload.data ] 
  }
  return state;
}
