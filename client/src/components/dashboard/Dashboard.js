import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "../../actions/profileActions";
import Spinner from "../common/Spinner";
import ProfileActions from "./ProfileActions";
import { getRegisteredTrials } from "../../actions/trialActions";
import TrialFeed from "../trials/TrialFeed";
import TrialForm from "../trials/TrialForm";

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
    this.props.getRegisteredTrials();
  }

  onDeleteClick(e) {
    this.props.deleteAccount();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;

    const { trials } = this.props.trial;
    let trialContent;

    if (trials === null || loading) {
      trialContent = "No Trials Found";
    } else {
      trialContent = <TrialFeed trials={trials} />;
    }

    if (profile === null || loading) {
      dashboardContent = <Spinner />;
    } else {
      // Check if logged in user has profile data
      if (Object.keys(profile).length > 0) {
        dashboardContent = (
          <div>
            <h1 className="display-4">
              Welcome <Link to={`/profile/${profile.handle}`}>{user.name}</Link>
            </h1>

            {user.type === "Researcher" && <TrialForm />}
            {user.type === "Participant" && <div>{trialContent}</div>}

            <div style={{ marginBottom: "60px" }} />

            <button
              onClick={this.onDeleteClick.bind(this)}
              className="btn btn-danger"
            >
              Delete My Account
            </button>
          </div>
        );
      } else {
        // User is logged in but has no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
          </div>
        );
      }
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">{dashboardContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getRegisteredTrials: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
  trial: state.trial
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount, getRegisteredTrials }
)(Dashboard);
