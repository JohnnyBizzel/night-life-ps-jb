import { renderComponent , expect, CustomProvider } from '../test_helper';
import { shallow, mount, render } from 'enzyme';
import sinon from 'sinon';
import React from 'react';

import Header from '../../src/components/header';

describe('Header' , () => {
  let wrapper;
  beforeEach(() => {
     wrapper = mount(
      <CustomProvider>
        <Header />
      </CustomProvider>
     );   
  });

  it('renders something', () => {
    expect(wrapper).to.exist;
    // console.log( wrapper.debug() )
  });

  it('has title nightlife when clicked sends to homepage', () => {
    expect(wrapper).to.include.text('Nightlife');
    expect(wrapper.find('nav').find('Link').findWhere(n => n.prop('to') === '/').length).to.equal(1)
  });

  it('has links to sign in and sign up', () => {
    expect(wrapper.find('.nav-link').length).to.equal(2);
    expect(wrapper.find('nav').find('Link').findWhere(n => n.prop('to') === '/signin').length).to.equal(1)
    expect(wrapper.find('nav').find('Link').findWhere(n => n.prop('to') === '/signup').length).to.equal(1)
  })

});
