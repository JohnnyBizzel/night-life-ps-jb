import React, {Component} from 'react'
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as actions from '../actions'

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = { term: '' }

    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onInputChange(event) {
    this.setState({ term: event.target.value})
  }

  onFormSubmit(event) {
    event.preventDefault();
    const user = this.props.user[0] !== undefined ? this.props.user[0]._id : ""
    this.props.fetchYelp(this.state.term, user).then(() => {
    let ids = (this.props.yelpListings[0].jsonBody.businesses).map(business =>{
      return business.id
    })
      this.props.getAllReservationsFromYelpList(ids).then(()=>{
        this.props.updateReservations(this.props.yelpListings[0].jsonBody.businesses, this.props.whosGoing.data)
        this.setState({ term: '' });
      })
    })
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit} className='input-group searchbox'>
        <input 
          placeholder='Enter a Location (City) and Country (Optional)'
          className='form-control '
          value={this.state.term}
          onChange={this.onInputChange}
        />
        <span className='input-group-btn'>
          <button type='submit' className='btn btn-secondary'>Submit</button>
        </span>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return { message: state.auth.message,
          yelpListings : state.yelpListings,
          whosGoing: state.rsvp.whosGoing,
          sortedWhosGoing: state.rsvp.sortedWhosGoing,
          user: state.user
         };
}

export default connect(mapStateToProps, actions)(SearchBar);