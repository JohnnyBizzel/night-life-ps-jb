import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {Link} from 'react-router';
import WhosGoingModal from './whosgoing_modal.js'

class YelpList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      whosGoing: []
    }
  }

  componentWillMount() {
    this.props.fetchUser(); // moved back here as I was having problems with the promise when not logged in
    console.log("component will mount");
  }
  componentDidMount() { // fetches data from yelp open api
    console.log("component did mount");
    //this.props.fetchUser().then(() => {
      let term = 'London';
      let userId = '';
      if (this.props.user) {
        term = this.props.user[0] !== undefined ? this.props.user[0].lastsearch : 'london'
        userId = this.props.user[0] !== undefined ? this.props.user[0]._id : ""  
      }
      
      this.getData(this.props.fetchYelp, term, userId)
    //});
    
  }

  componentWillReceiveProps(nextProps) {
    console.log("component will rec props")
    if(nextProps.sortedWhosGoing) {
      if(nextProps.sortedWhosGoing !== this.props.sortedWhosGoing) {
        this.setState({whosGoing: nextProps.sortedWhosGoing})
      }
    }
  }

  getData(dataType, city, userId) {
    console.log("getData:", city)
    console.log("user ID:", userId)
    dataType(city, userId).then(() => {
      let ids = (this.props.yelpListings[0].jsonBody.businesses).map(business =>{
        return business.id
      })
      this.props.getAllReservationsFromYelpList(ids).then(()=>{
        // after getting the businesses from the Yelp API, find any which are in our Db.
        // then match these with the order of items on the page
      this.props.updateReservations(this.props.yelpListings[0].jsonBody.businesses, this.props.whosGoing)  
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

  // Add or remove RSVP
  onClickSubmit(index, businessID, event, userIsGoing) {
    event.preventDefault();
    console.log("user is going:", userIsGoing)
    if (userIsGoing) {
      console.log("del RSVP:", businessID)
      console.log(this.props.whosGoing)
      let resForBusiness = 0;
      let curRes = [] // current reservations
      const allReservations = (this.props.whosGoing)
      allReservations.forEach((bus) => {
        if(bus.id === businessID) {
          resForBusiness = bus.user_reservations.length;
          if (resForBusiness > 0) {
            // check if current user is in reservation array and remove
            curRes = bus.user_reservations;
            curRes = curRes.filter((ur) => {
               return ur.email != this.props.user[0].email 
            })
          }
        }
      })
      console.log('Num other reservations: ', resForBusiness)
      if (resForBusiness > 0) {
        // modify the user_reservations array 
        this.props.removeOneRSVP(businessID, curRes).then(() => {
          this.updateWhosGoing(index, businessID)
        })
      } else {
        // delete this business from the db
        this.props.deleteRSVP(businessID).then(() => {
          this.updateWhosGoing(index, businessID)
        })
      }
    } else {
      console.log("add RSVP:", businessID)
      this.props.addRSVP(businessID).then(() => {
        this.updateWhosGoing(index, businessID)
      })
    }
  }

  renderListing(data, userIsLoggedIn) {
    return data.map((yelpData, idx) => {
      let usersWhoAreGoing = [], users = []
      let userIsGoing = false
      
      if(this.state.whosGoing[idx] ) {
        users = this.state.whosGoing[idx].user_reservations
        usersWhoAreGoing = (this.state.whosGoing[idx].user_reservations).map((item) => {
          return item.email
        })
      }

      if (userIsLoggedIn) {
         //console.log("Render listing Curr user:", this.props.user[0])
        userIsGoing = usersWhoAreGoing.includes(this.props.user[0].email)
      }
      
      return (
      <div className="card" key={idx}>
        <img className="card-img-top" src={(yelpData.image_url).replace('o.jpg','348s.jpg')} alt={yelpData.name} />
        <div className="card-block">
          <a href={yelpData.url} target="_blank"><h4 className="card-title">{yelpData.name} <i className="fa fa-external-link" aria-hidden="true"></i></h4></a>
          <p className="card-text">Rating (out of 5): {yelpData.rating}</p>
          <p className="card-text">Location: {yelpData.location.address1}, {yelpData.location.city}, {yelpData.location.zip_code}</p>
          {!userIsLoggedIn ? 
            <Link className="btn btn-primary" to="/signin">Sign in to RSVP</Link> : 
            <a href="#" className="btn btn-primary" onClick={(e)=> this.onClickSubmit(idx, yelpData.id, e, userIsGoing)}>{userIsGoing ? "Remove RSVP" : "Add RSVP" }</a>
          }
          {users.length > 0 ? <WhosGoingModal users={users}/> : <span className="nogo-message"> No one's going tonight</span>}
        </div>
      </div>
      );
    });
  }  

  render() {
    //console.log('Rendering, user:', this.props.user)
    let gotUser = false;
    if (this.props.user) {
          if (this.props.user[0] !== undefined)
            gotUser = true;
    }
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
        {gotUser ? <span>Hi, {this.props.user[0].firstname}</span> : <br/>}
        <div className='d-flex flex-wrap justify-content-between yelp-list'>
          {this.renderListing(this.props.yelpListings[0].jsonBody.businesses, gotUser)}
        </div> 
      </div>
    );
  }
}

function mapStateToProps(state) {
          console.log('YelpList mapping state to props:', state)
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