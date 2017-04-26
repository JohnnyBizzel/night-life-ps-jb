import { FETCH_RSVP, ADD_RSVP, FETCH_WHOSGOING, SORTED_WHOSGOING } from '../actions/types'

export default function(state={}, action) {
  switch (action.type) {
    case FETCH_RSVP: 
      return { fetch: action.payload.data, ...state }
    case ADD_RSVP: 
      return { add: action.payload.data, ...state }
    case FETCH_WHOSGOING:
      return { ...state, whosGoing: action.payload }
    case SORTED_WHOSGOING: 
      return { ...state, sortedWhosGoing: action.payload  }
  }
  return state;
}
