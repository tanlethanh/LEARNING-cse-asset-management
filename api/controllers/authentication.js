// const express = require("express")
// const mongoose = require("mongoose")
// const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")

// import models
const User = require("../models/user")

const saltRounds = 10;

exports.signup = (req, res) => {

    // console.log(req)
    console.log(req.body)
    // res.json({
    //     mess:"hello"
    // })
    /* add email verification */
    const password = req.body.password

    console.log(password)

    bcrypt.hash(password, saltRounds).then(function(hash) {
        // Store hash in your password DB.

        console.log("hello")


        newUser = new User({
            isAdmin: req.body.isAdmin,
            fullName: req.body.fullName,
            studentCode: req.body.studentCode,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            hash_password: hash
        })

        newUser.save((err, user) => {
            if (err) {
                res.status(400).json({
                    mess: "Unable to add new user!",
                    err
                })
            }
            else {
                res.json({
                    mess: "Add new user successfully",
                    user
                })
            }
        })

    });

    
}

exports.signin = (req, res) => {

    const {email, password} = req.body

    User.findOne({email}, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "Email was not found"
            })
        }
        
        if (user.enable == false) {
            return res.status(400).json({
                error: "Account is not active"
            })
        }

        bcrypt.compare(password, user.hash_password).then(function(equal) {
            // result == true
            if (equal) {
                // sign in
            }
            else {
                return res.status(400).json({
                    error: "Password is wrong"
                })
            }
        });

    })
    
    bcrypt.compare(myPlaintextPassword, hash).then(function(result) {
        // result == true
    });
}

exports.signout = (req, res) => {
    
}