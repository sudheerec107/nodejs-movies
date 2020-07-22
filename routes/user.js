const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const errorHandler = require('../utils/utils');

const saveUser = (email, password, cb) => {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hashPassword) => {
        if (!err) {
            const newUser = new User({
                email,
                password: hashPassword
            });
            newUser.save((err) => {
                if (!err) {
                    cb(null, { msg: 'Account have been created successfully' });
                } else {
                    cb({ msg: 'Error occured while creating the account' });
                }
            });
        } else {
            cb({ msg: 'Error occured while creating the account' });
        }
    });
}

router.post('/register',
    [
        body('email').isEmail(),
        body('email').notEmpty(),
        body('password').isLength({ min: 5 })
    ], async (req, res) => {
        const { email, password, passwordCheck } = req.body;
        const errors = validationResult(req);
        if (errors.errors.length > 0) {
            return res.status(400).json({ msg: 'Invalid ' + errors.errors[0].param + ' field' });
        } else if (password != passwordCheck) {
            return res.status(400).json({ msg: 'Password and confirmed password must match' });
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists with same email' });
        }
        saveUser(email, password, (error, message) => {
            if (!error) {
                res.json(message);
            } else {
                res.status(500).json(error);
            }
        });

    }, errorHandler);

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'All the fields are not filled' });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(400).json({ msg: 'Invalid password or email' });
    } else {
        bcrypt.compare(password, user.password, (err, result) => {
            if (err || !result) {
                return res.status(400).json({ msg: 'Invalid password or email' });
            } else {
                let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1d' });
                return res.json({ token, user: { email: user.email, displayName: user.displayName } });
            }
        });
    }
}, errorHandler);

module.exports = router;
