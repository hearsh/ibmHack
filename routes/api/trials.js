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
router.get("/findid", (req, res) => {
  Trial.findById(req.params.id)
    .then(trial => res.json(trial))
    .catch(err =>
      res.status(404).json({ notrialfound: "No trial found with that ID...." })
    );
});

// @route   GET api/trials/:id
// @desc    Get trial by user
// @access  Public
router.post("/getTrials", (req, res) => {
  Trial.find().then(trial => {
    let data = [];
    trial.forEach((data) => {
      if (data.user === req.body.id) {
        data.push({
          title: data.title,
          users: data.interesteds,
        })
      }
    });
    if (data.length) {
      res.json({
        data: data,
        message: 'Got the users',
        status: 200,
      })
    } else {
      res.json({
        data: data,
        message: 'No Intrests found with that ID',
        status: 400,
      })
    }
  }).catch(err => {
      console.log(err);
      res.status(404).json({ notrialfound: "No trial found with that ID...." })
  });
});

// @route   GET api/trials/filter
// @desc    Filter Feed
// @access  Private

router.get(
  "/filter",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Trial.find()
        .then(trials => {
          var filteredtrials = [];
          trials.forEach(function(entry) {
            if (
              entry.inclusion &&
              entry.inclusion.age === profile.age &&
              entry.inclusion.gender === profile.gender &&
              entry.inclusion.condition === profile.condition
            ) {
              filteredtrials.push(entry);
            }
          });
          if (filteredtrials.length <= 0) {
            return res.status(404).json({ notauthorized: "No trials found" });
          } else {
            res.json(filteredtrials);
          }
        })
        .catch(err =>
          res.status(404).json({ trialnotfound: "No trial found" })
        );
    });
  }
);

// @route   GET api/trials/registered
// @desc    Registered Feed
// @access  Private

router.get(
  "/registered",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Trial.find()
        .then(trials => {
          var filteredtrials = [];
          trials.forEach(function(entry) {
            entry.interesteds.forEach(function(participant) {
              if (
                profile.user.toString().trim() ===
                participant.user.toString().trim()
              ) {
                filteredtrials.push(entry);
              }
            });
          });
          if (filteredtrials.length <= 0) {
            return res.status(404).json({ notauthorized: "No trials found" });
          } else {
            res.json(filteredtrials);
          }
        })
        .catch(err =>
          res.status(404).json({ trialnotfound: "No trial found" })
        );
    });
  }
);

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
    newTrial.inclusion = {};
    if (req.body.age) {
      newTrial.inclusion.age = req.body.age;
    }
    if (req.body.gender) {
      newTrial.inclusion.gender = req.body.gender;
    }
    if (req.body.condition) {
      newTrial.inclusion.condition = req.body.condition;
    }

    newTrial.save().then(trial => {
      console.log(trial), res.json(trial.data);
    });
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
