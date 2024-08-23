require('dotenv').config({ path: '.env' })
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.signup = (req, res) => {
    bcrypt
        .hash(req.body.password, 10)
        .then((result) => {
            const user = new User({
                email: req.body.email,
                password: result,
            })
            user.save()
                .then(() =>
                    res
                        .status(201)
                        .json({ message: 'A new user has been created.' })
                )
                .catch((error) => res.status(400).json({ error }))
        })
        .catch((error) => res.status(500).json({ error }))
}

exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res
                    .status(401)
                    .json({ message: 'Invalid username or password.' })
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res
                            .status(401)
                            .json({ message: 'Invalid username or password.' })
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_PASSWORD,
                            {
                                expiresIn: '24h',
                            }
                        ),
                    })
                })
                .catch((error) => res.status(500).json({ error }))
        })
        .catch((error) => res.status(500).json({ error }))
}
