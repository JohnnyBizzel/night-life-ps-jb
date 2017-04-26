import React from 'react';
import SearchBar from '../containers/search_bar';
import YelpList from '../containers/yelp_list';

export default () => <div className="welcome">
                      <div className="heading text-center">Welcome to the <span className="appname">Nightlife App</span></div> 
                      <div className='subheading text-center'><i>Search a location for restaurants near you and signup to let others know you plan to visit</i></div>
                      <SearchBar />
                      <YelpList />                      
                    </div>;
