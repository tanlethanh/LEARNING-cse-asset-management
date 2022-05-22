const bcrypt = require("bcrypt")

// import models
const User = require("../models/user")

const saltRounds = 10;

exports.signup = (req, res) => {

    try {
        const password = req.body.password

        bcrypt.hash(password, saltRounds).then(function (hash) {
            // Store hash in your password DB.

            newUser = new User({
                isAdmin: req.body.isAdmin,
                fullName: req.body.fullName,
                studentCode: req.body.studentCode,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                hash_password: hash
            })

            if (req.body.enable == "true") {
                newUser.enable = true;
            }

            newUser.save((err, user) => {
                if (err) {
                    res.status(400).json({
                        mess: "Unable to add new user",
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

        })
    } catch (error) {
        console.log(error)
        res.json({
            "mess": "Sign up fail"
        })
    }


}

exports.signin = (req, res) => {

    const { email, password } = req.body

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            res.status(400).json({
                error: "Email was not found"
            })
        }
        else if (user.enable == false) {
            res.status(400).json({
                error: "Account is not active"
            })
        }
        else { // check password - account in database, it's enable
            bcrypt.compare(password, user.hash_password).then(function (equal) {
                // result == true
                if (equal) {
                    // sign in
                    return res.json({
                        mess: "sign in successfully",
                        user
                    })
                }
                else {
                    return res.status(400).json({
                        error: "Password is wrong"
                    })
                }
            });
        }

    })

    // bcrypt.compare(myPlaintextPassword, hash).then(function(result) {
    //     // result == true
    // });
}

exports.signout = (req, res) => {

}