import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TextFieldGroup from "../common/TextFieldGroup";
import { addTrial } from "../../actions/trialActions";

class TrialForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      condition: "",
      location: "",
      description: "",
      moredetaillink: "",
      age: "",
      gender: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const { user } = this.props.auth;

    const newTrial = {
      title: this.state.title,
      condition: this.state.condition,
      location: this.state.location,
      description: this.state.description,
      moredetaillink: this.state.moredetaillink,
      age: this.state.age,
      gender: this.state.gender
    };

    this.props.addTrial(newTrial);
    this.setState({
      title: "",
      condition: "",
      location: "",
      description: "",
      moredetaillink: "",
      age: "",
      gender: ""
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">Create Trial</div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <TextFieldGroup
                  placeholder="Enter the title"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  error={errors.title}
                />
              </div>
              <div className="form-group">
                <TextFieldGroup
                  placeholder="Enter the condition"
                  name="condition"
                  value={this.state.condition}
                  onChange={this.onChange}
                  error={errors.condition}
                />
              </div>
              <div className="form-group">
                <TextFieldGroup
                  placeholder="Enter the location"
                  name="location"
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
                />
              </div>
              <div className="form-group">
                <TextFieldGroup
                  placeholder="Enter the description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                />
              </div>
              <div className="form-group">
                <TextFieldGroup
                  placeholder="Enter the moredetaillink"
                  name="moredetaillink"
                  value={this.state.moredetaillink}
                  onChange={this.onChange}
                  error={errors.moredetaillink}
                />
              </div>
              <div className="form-group">
                <TextFieldGroup
                  placeholder="Enter the gender"
                  name="gender"
                  value={this.state.gender}
                  onChange={this.onChange}
                  error={errors.gender}
                />
              </div>
              <div className="form-group">
                <TextFieldGroup
                  placeholder="Enter the condition"
                  name="condition"
                  value={this.state.condition}
                  onChange={this.onChange}
                  error={errors.condition}
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="Number"
                  placeholder="Enter Age"
                />
              </div>
              <button type="submit" className="btn btn-dark">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

TrialForm.propTypes = {
  addTrial: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addTrial }
)(TrialForm);
