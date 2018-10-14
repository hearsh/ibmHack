import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import logo from "../../img/Logo.jpg";
import Login from "../auth/Login";

class Landing extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  render() {

    return (
      <div className="landing">
        <div className="landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 style={{ color: "black", marginBottom: '1rem' }} className="display-4">
                  ClinTrials
                </h1>
                <p className='lead' style={{color: '#222',}}>
                  We help match Trials to Participants
                </p>
                <Login/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);
