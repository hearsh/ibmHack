import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import ProfileItem from "./ProfileItem";
import { getProfiles } from "../../actions/profileActions";
import { getProfileIntrested } from "../../actions/profileActions";

class Profiles extends Component {
  componentDidMount() {
    this.props.getProfiles();
    let { isAuthenticated, user } = this.props.auth;
    this.props.getProfileIntrested(user.id);
  }

  render() {
    const { profiles, loading } = this.props.profile;
    let profileItems;
    let userData = this.props.userData;

    if (userData === null || loading) {
      profileItems = <Spinner />;
    } else {
      if (userData.length > 0) {
        profileItems = userData.map(userData => (
          <ProfileItem key={userData._id} profile={userData} />
        ));
      } else {
        profileItems = <h4>No profiles found...</h4>;
      }
    }

    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">User Profiles</h1>
              <p className="lead text-center" />
              {profileItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  getProfileIntrested: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
  userData: state.profile.userData,
});

export default connect(
  mapStateToProps,
  { getProfiles, getProfileIntrested }
)(Profiles);
