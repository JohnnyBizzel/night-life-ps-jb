import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {Link} from 'react-router';
import SearchBar from '../containers/search_bar';
import YelpList from '../containers/yelp_list';

class Feature extends Component {
  componentWillMount() {
    this.props.fetchMessage();
  }

  render() {
    return (
      <div>
        <h3 className="heading text-center title">Your Listings</h3>
        <SearchBar />
        <YelpList />
        {/*<div>{this.props.message}</div>*/}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { message: state.auth.message };
}

export default connect(mapStateToProps, actions)(Feature);
