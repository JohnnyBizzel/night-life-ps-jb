import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {Link} from 'react-router';
import WhosGoingModal from './whosgoing_modal.js'

class YelpList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      whosGoing: [],
      isUserGoing: false,
      isOpen: false
    }
  }

  componentWillMount() { // fetch logged in user data from api
   this.props.fetchUser();
  }

  componentDidMount() { // fetches data from yelp open api
    const term = this.props.user[0] !== undefined ? this.props.user[0].lastsearch : 'london'
    const user = this.props.user[0] !== undefined ? this.props.user[0]._id : ""
    this.getData(this.props.fetchYelp, term, user)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.sortedWhosGoing) {
      if(nextProps.sortedWhosGoing !== this.props.sortedWhosGoing) {
        this.setState({whosGoing: nextProps.sortedWhosGoing})
      }
    }
  }

  getData(dataType, city) {
    dataType(city).then(() => {
      let ids = (this.props.yelpListings[0].jsonBody.businesses).map(business =>{
        return business.id
      })
      this.props.getAllReservationsFromYelpList(ids).then(()=>{
      this.props.updateReservations(this.props.yelpListings[0].jsonBody.businesses, this.props.whosGoing.data)  
        this.setState({
          whosGoing: this.props.sortedWhosGoing
        })
      })
    })
  }

  updateWhosGoing(index, businessID) {
      return fetch(`/api/businesses?id=${businessID}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'authorization': localStorage.getItem('token')
        },
        method: "GET"
      }).then((blob) => {
        return blob.json()
      }).then((res) => {
        this.setState(prev => ({whosGoing: prev.whosGoing.slice(0, index).concat([res]).concat(prev.whosGoing.splice(index+1))}))
      })
  }  

  onClickSubmit(index, businessID, event, toggle) {
    event.preventDefault();

    if (toggle) {
      this.props.deleteRSVP(businessID).then(() => {
        this.updateWhosGoing(index, businessID)
      })
    } else {
      this.props.addRSVP(businessID).then(() => {
        this.updateWhosGoing(index, businessID)
      })
    }
  }

  renderListing(data) {
    return data.map((yelpData, idx) => {
      let val = [], users = []
      let toggle = false
      
      if(this.state.whosGoing[idx] ) {
        users = this.state.whosGoing[idx].user_reservations
        val = (this.state.whosGoing[idx].user_reservations).map((item) => {
          return item._id
        })
      }

      if (this.props.user[0]) {
        toggle = val.includes(this.props.user[0]._id)
      }
      
      return (
      <div className="card" key={idx}>
        <img className="card-img-top" src={(yelpData.image_url).replace('o.jpg','348s.jpg')} alt={yelpData.name} />
        <div className="card-block">
          <a href={yelpData.url} target="_blank"><h4 className="card-title">{yelpData.name} <i className="fa fa-external-link" aria-hidden="true"></i></h4></a>
          <p className="card-text">Rating (out of 5): {yelpData.rating}</p>
          <p className="card-text">Location: {yelpData.location.address1}, {yelpData.location.city}, {yelpData.location.zip_code}</p>
          {this.props.user[0] === undefined ? 
            <Link className="btn btn-primary" to="/signin">Sign in to RSVP</Link> : 
            <a href="#" className="btn btn-primary" onClick={(e)=> this.onClickSubmit(idx, yelpData.id, e, toggle)}>{toggle ? "Remove RSVP" : "Add RSVP" }</a>
          }
          {users.length > 0 ? < WhosGoingModal users={users}/> : <span className="nogo-message"> No one's going tonight</span>}
        </div>
      </div>
      );
    });
  }  

  render() {
    console.log(this.props.user)
    if (this.props.yelpListings.length < 1) {  
      return (
        <div>
          <br />
          Loading....
        </div>
      )
    }

    return (
      <div>
        <br/>
        
        <div className='d-flex flex-wrap justify-content-between yelp-list'>
          {this.renderListing(this.props.yelpListings[0].jsonBody.businesses)}
        </div> 
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { message: state.auth.message,
          yelpListings : state.yelpListings,
          sampleData: state.sampleData,
          add_RSVP: state.rsvp.add,
          fetch_RSVP: state.rsvp.fetch,
          user: state.user,
          whosGoing: state.rsvp.whosGoing,
          sortedWhosGoing: state.rsvp.sortedWhosGoing
         };
}

export default connect(mapStateToProps, actions)(YelpList);