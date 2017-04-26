import {expect } from '../test_helper';
import {AUTH_ERROR, UNAUTH_USER, AUTH_USER, FETCH_MESSAGE} from '../../src/actions/types'
import authReducer from '../../src/reducers/auth_reducer'

describe('AUTH Reducer', () => {
  describe('authError', () => {

    it('handles action with unknown type', () => {
      expect(authReducer({}, 't')).to.eql({})
    })

    it('handles action of type AUTH_ERROR', () => {
      const action = {type: AUTH_ERROR, payload: 'error'}
      expect(authReducer({}, action)).to.eql({error: 'error'})
    })

  })
})