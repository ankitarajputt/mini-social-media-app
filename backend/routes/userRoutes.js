const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");



// =======================
// TEST ROUTE
// =======================

router.get("/test", (req, res) => {

    res.send("Test route working");
});



// =======================
// REGISTER USER
// =======================

router.post("/register", async (req, res) => {

    try {

        // check existing user
        const existingUser = await User.findOne({
            email: req.body.email
        });

        if (existingUser) {

            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(
            req.body.password,
            10
        );

        // create user
        const newUser = new User({

            name: req.body.name,

            email: req.body.email,

            password: hashedPassword
        });

        await newUser.save();

        res.json({
            message: "User registered successfully"
        });

    } catch (error) {

        res.status(500).json(error);
    }
});



// =======================
// LOGIN USER
// =======================

router.post("/login", async (req, res) => {

    try {

        const user = await User.findOne({
            email: req.body.email
        });

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        // compare password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!validPassword) {

            return res.status(400).json({
                message: "Wrong password"
            });
        }

        // create token
        const token = jwt.sign(

            {
                id: user._id
            },

            "secretkey"
        );

        res.json({

            id: user._id,

            name: user.name,

            token: token
        });

    } catch (error) {

        res.status(500).json(error);
    }
});



module.exports = router;