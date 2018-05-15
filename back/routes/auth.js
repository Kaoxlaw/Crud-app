import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import Token from '../models/Token';

let auth = express.Router();
let authbearer = 'i\'m the one';


auth.post("/signup", (req, res) => {
  if (req.body.username && req.body.password) {
    User.findOne({
      username: req.body.username
    }, (err, result) => {
      if (result === null) {
        let newUser = new User(req.body);
        newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
        newUser.save((err, user) => {
          if (err) {
            res.status(400).json({
              success: false,
              message: err.message
            });
          } else {
            res.status(200).json({
              success: true,
              message: `Hi and Welcome, your profile is now created!`,
              content: user
            });
          }
        });
      } else {
        res.status(412).json({
          success: true,
          message: "This Username is already taken, Please choose another one."
        });
      }
    });
  } else {
    res.status(412).json({
      success: false,
      message: "Username or Password are missing, Please retry!!"
    });
  }
});

auth.post("/signin", (req, res) => {
  if (req.body.username && req.body.password) {
    User.findOne({
      username: req.body.username
    }, (err, user) => {
      if (err) res.status(500).json({
        success: false,
        message: err.message
      });
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'This username doesn\'t exist!'
        })
      } else if (user) {
        if (!user.comparePassword(req.body.password)) {
          res.status(401).json({
            success: false,
            message: 'Wrong Password, Please retry with the good one!'
          })
        } else {
          jwt.sign({
            username: user.username
          }, 'Totoro', (err, result) => {
            let newToken = new Token({
              token: result
            });
            newToken.save((err) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: err.message
                })
              } else {
                res.status(200).json({
                  success: true,
                  message: 'Welcome on your profile!',
                  content: {
                    token: authbearer + ' ' + result,
                    userID: user._id
                  }
                })
              }
            })
          })
        }
      }
    })
  } else {
    res.status(412).json({
      sucess: false,
      messages: 'Username or Password are missing, Please retry!!'
    })
  };
});

auth.put("/edit/:id", (req, res) => {

  let _mySetObj = {};

  if (req.body.username) _mySetObj['username'] = req.body.username;
  if (bcrypt.hashSync(req.body.password, 10)) _mySetObj['hash_password'] = bcrypt.hashSync(req.body.password, 10)
  if (req.body.lastname) _mySetObj['lastname'] = req.body.lastname;
  if (req.body.adress) _mySetObj['adress'] = req.body.adress;
  if (req.body.age) _mySetObj['age'] = req.body.age;

  User.findByIdAndUpdate({
    _id: req.params.id
  }, {
    $set: _mySetObj
  }, {
    upsert: true
  }, (err, user) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Profile Updated!'
      });
    }
  });
});

auth.delete("/delete/:id", (req, res) => {

  User.findOneAndRemove({
    _id: req.params.id
  }, (err, user) => {
    if (err) {
      console.log('here is the error')
      res.status(500).json({
        success: false,
        message: err.message
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'User deleted!'
      })
    }
  })
})

export default auth;
