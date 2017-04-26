import { renderComponent , expect, CustomProvider } from '../../test_helper';
import { shallow, mount, render } from 'enzyme';
import sinon from 'sinon';
import React from 'react';

import Signout from '../../../src/components/auth/signout';

xdescribe('Signout' , () => {
  let wrapper;
  console.log(wrapper)
  beforeEach(() => {
     wrapper = mount(
      <CustomProvider>
        <Signout />
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

}); 

