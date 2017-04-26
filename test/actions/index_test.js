import {expect } from '../test_helper';
import {AUTH_ERROR} from '../../src/actions/types'
import {authError} from '../../src/actions/index'

describe('actions', () => {
  describe('authError', () => {

    it('has the correct type', () => {
      const action = authError();
      expect(action.type).to.equal(AUTH_ERROR)
    })

    it('has the correct payload', () => {
      const action = authError('error');
      expect(action.payload).to.equal('error');
    })

  })
})