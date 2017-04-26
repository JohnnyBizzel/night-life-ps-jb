import { FETCH_YELP } from '../actions/types'

export default function(state=[], action) {
  switch (action.type) {
    case FETCH_YELP: 
      return [ action.payload.data, ...state ] 
  }
  return state;
}
