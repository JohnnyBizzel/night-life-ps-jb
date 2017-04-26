import { renderComponent , expect, CustomProvider } from '../../test_helper';
import { shallow, mount, render } from 'enzyme';
import sinon from 'sinon';
import React from 'react';

import Signin from '../../../src/components/auth/signin';

describe('Signin' , () => {
  let wrapper;
  console.log(wrapper)
  beforeEach(() => {
     wrapper = mount(
      <CustomProvider>
        <Signin />
      </CustomProvider>
     );   
  });

  it('renders something', () => {
    expect(wrapper).to.exist;
    // console.log( wrapper.debug() )
  });

  it('should have an input box for email and password', () => {
    // todo
  })

  it('should have an input box for email and password', () => {
    expect(wrapper.find('input').length).to.equal(2)
  })

}); 

