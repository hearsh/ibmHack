import React, { Component } from "react";
import PropTypes from "prop-types";
import TrialItem from "./TrialItem";

class TrialFeed extends Component {
  render() {
    const { trials } = this.props;

    return trials.map(trial => <TrialItem key={trial._id} trial={trial} />);
  }
}

TrialFeed.propTypes = {
  trials: PropTypes.array.isRequired
};

export default TrialFeed;
