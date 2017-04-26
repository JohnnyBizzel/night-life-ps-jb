import React, { Component } from 'react';
import Modal from 'react-awesome-modal';

export default class Examples extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false
        }
    }

    openModal(e) {
        e.preventDefault();
        this.setState({
            visible : true
        });
    }

    closeModal() {
        this.setState({
            visible : false
        });
    }

    renderWhosGoingList(data) {
        return data.map((data, idx) => {
            return (
                <li className ='list-group-item' key ={idx}>
                    {data.firstname} {data.lastname}, <a href={`mailto: ${data.email}`}>E-Mail</a>
                </li>
            )
        })
    }

    render() {
        return (
            <div className="whosgoing">
                <a href="#" className="going " value="Open" onClick={(e) => this.openModal(e)} >Who's going: {this.props.users.length} <i className="fa fa-external-link" aria-hidden="true"></i></a>
                <Modal 
                    visible={this.state.visible}
                    width="400"
                    height="300"
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    <div className="whosgoing-modal">
                        <h2 className ='text-center'>Who's going</h2>
                        <ul className = 'list-group' >
                            {this.renderWhosGoingList(this.props.users)}
                        </ul>   
                        <a className="btn btn-primary" href="javascript:void(0);" onClick={() => this.closeModal()}>Close</a>
                    </div>
                </Modal>
            </div>
        );
    }
}