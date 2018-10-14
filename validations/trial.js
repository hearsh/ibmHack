const validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateTrialInput(data) {
  let errors = {};

  //If the field is Empty i want to set it as a blank string
  data.title = !isEmpty(data.title) ? data.title : "";
  data.condition = !isEmpty(data.condition) ? data.condition : "";
  data.location = !isEmpty(data.location) ? data.location : "";
  data.moredetaillink = !isEmpty(data.moredetaillink)
    ? data.moredetaillink
    : "";

  if (validator.isEmpty(data.title)) {
    errors.title = "title field is required";
  }
  if (validator.isEmpty(data.condition)) {
    errors.condition = "condition field is required";
  }
  if (validator.isEmpty(data.location)) {
    errors.location = "location field is required";
  }
  if (validator.isEmpty(data.moredetaillink)) {
    errors.moredetaillink = "moredetaillink field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
