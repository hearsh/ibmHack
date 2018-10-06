import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TrialFeed from "./TrialFeed";
import Spinner from "../common/Spinner";
import { getTrials } from "../../actions/trialActions";

class Trials extends Component {
  componentDidMount() {
    this.props.getTrials();
  }

  render() {
    const { trials, loading } = this.props.trial;
    let trialContent;

    if (trials === null || loading) {
      trialContent = <Spinner />;
    } else {
      trialContent = <TrialFeed trials={trials} />;
    }

    return (
      <div className="feed">
        <div className="container">
          <div className="row">
            <div className="centretrial">
              <h1>Hi you matched with these clinical trials!</h1>
            </div>
            <div className="col-md-12">{trialContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

Trials.propTypes = {
  getTrials: PropTypes.func.isRequired,
  trial: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  trial: state.trial
});

export default connect(
  mapStateToProps,
  { getTrials }
)(Trials);
