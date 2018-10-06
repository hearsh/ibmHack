const validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateProfileInput(data) {
  let errors = {};

  //If the field is Empty i want to set it as a blank string
  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.gender = !isEmpty(data.gender) ? data.gender : "";
  data.age = !isEmpty(data.age) ? data.age : "";

  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle must be between 2 and 40 characters";
  }

  if (validator.isEmpty(data.handle)) {
    errors.handle = "Handle field is required";
  }
  if (validator.isEmpty(data.age)) {
    errors.age = "age field is required";
  }
  if (validator.isEmpty(data.gender)) {
    errors.gender = "gender field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
