import React from 'react';
import SearchBar from '../containers/search_bar';
import YelpList from '../containers/yelp_list';

export default () => <div className="welcome">
                      <div className="heading text-center">The Night Life Co-ordinator App</div> 
                      <div className='subheading text-center'><i>Search a location for restaurants near you, 
                        then sign up or log in to let others know you plan to visit</i></div>
                      <SearchBar />
                      <YelpList />                      
                    </div>;
