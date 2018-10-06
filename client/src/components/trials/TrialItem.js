import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import {
  deleteTrial,
  addInterested,
  removeInterested
} from "../../actions/trialActions";

class TrialItem extends Component {
  onDeleteClick(id) {
    this.props.deleteTrial(id);
  }

  onInterestedClick(id) {
    this.props.addInterested(id);
  }

  onUninterestedClick(id) {
    this.props.removeInterested(id);
  }

  findUserInterested(interesteds) {
    const { auth } = this.props;
    if (
      interesteds.filter(interested => interested.user === auth.user.id)
        .length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { trial, auth, showActions } = this.props;

    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-10">
            <h3>
              <b>{trial.title}</b>
            </h3>
            <h3>
              <b>Condition: {trial.condition}</b>
            </h3>
            <h3>
              <b>Location: {trial.location}</b>
            </h3>
            <p>{trial.description}</p>
            <p>
              <a href={trial.moredetaillink}> Details: </a>
            </p>
            {showActions ? (
              <span>
                <button
                  onClick={this.onInterestedClick.bind(this, trial._id)}
                  type="button"
                  className="btn btn-light mr-1"
                >
                  <i
                    className={classnames("fas fa-thumbs-up", {
                      "text-info": this.findUserInterested(trial.interesteds)
                    })}
                  />
                  <span className="badge badge-light">
                    {trial.interesteds.length}
                  </span>
                  Interested
                </button>
                <button
                  onClick={this.onUninterestedClick.bind(this, trial._id)}
                  type="button"
                  className="btn btn-light mr-1"
                >
                  <i className="text-secondary fas fa-thumbs-down" />
                  Not Interested
                </button>
                {trial.user === auth.user.id ? (
                  <button
                    onClick={this.onDeleteClick.bind(this, trial._id)}
                    type="button"
                    className="btn btn-danger mr-1"
                  >
                    <i className="fas fa-times" />
                    Delete
                  </button>
                ) : null}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

TrialItem.defaultProps = {
  showActions: true
};

TrialItem.propTypes = {
  deleteTrial: PropTypes.func.isRequired,
  addInterested: PropTypes.func.isRequired,
  removeInterested: PropTypes.func.isRequired,
  trial: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteTrial, addInterested, removeInterested }
)(TrialItem);
