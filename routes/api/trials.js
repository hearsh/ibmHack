const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Trial model
const Trial = require("../../models/Trial");
// Profile model
const Profile = require("../../models/Profile");

// Validation
const validateTrialInput = require("../../validations/trial");

// @route   GET api/trials/test
// @desc    Tests trial route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Trial Works" }));

// @route   GET api/trials
// @desc    Get trials
// @access  Public
router.get("/", (req, res) => {
  Trial.find()
    .sort({ date: -1 })
    .then(trials => res.json(trials))
    .catch(err => res.status(404).json({ notrialsfound: "No trials found" }));
});

// @route   GET api/trials/:id
// @desc    Get trial by id
// @access  Public
router.get("/:id", (req, res) => {
  Trial.findById(req.params.id)
    .then(trial => res.json(trial))
    .catch(err =>
      res.status(404).json({ notrialfound: "No trial found with that ID" })
    );
});

// @route   POST api/trials
// @desc    Create trial
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateTrialInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newTrial = new Trial({
      title: req.body.title,
      condition: req.body.condition,
      location: req.body.location,
      description: req.body.description,
      user: req.user.id,
      moredetaillink: req.body.moredetaillink
    });

    newTrial.save().then(trial => res.json(trial));
  }
);

// @route   DELETE api/trials/:id
// @desc    Delete trial
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Trial.findById(req.params.id)
        .then(trial => {
          // Check for trial owner
          if (trial.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }

          // Delete
          trial.remove().then(() => res.json({ success: true }));
        })
        .catch(err =>
          res.status(404).json({ trialnotfound: "No trial found" })
        );
    });
  }
);

// @route   POST api/trials/interested/:id
// @desc    Interested trial
// @access  Private
router.post(
  "/interested/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Trial.findById(req.params.id)
        .then(trial => {
          if (
            trial.interesteds.filter(
              interested => interested.user.toString() === req.user.id
            ).length > 0
          ) {
            return res.status(400).json({
              alreadyinterested: "User already interested this trial"
            });
          }

          // Add user id to interesteds array
          trial.interesteds.unshift({ user: req.user.id });

          trial.save().then(trial => res.json(trial));
        })
        .catch(err =>
          res.status(404).json({ trialnotfound: "No trial found" })
        );
    });
  }
);

// @route   POST api/trials/uninterested/:id
// @desc    Uninterested trial
// @access  Private
router.post(
  "/uninterested/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Trial.findById(req.params.id)
        .then(trial => {
          if (
            trial.interesteds.filter(
              interested => interested.user.toString() === req.user.id
            ).length === 0
          ) {
            return res.status(400).json({
              notinterested: "You have not yet interested this trial"
            });
          }

          // Get remove index
          const removeIndex = trial.interesteds
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of array
          trial.interesteds.splice(removeIndex, 1);

          // Save
          trial.save().then(trial => res.json(trial));
        })
        .catch(err =>
          res.status(404).json({ trialnotfound: "No trial found" })
        );
    });
  }
);

module.exports = router;
