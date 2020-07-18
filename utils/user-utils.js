const bcrypt = require('bcryptjs');

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

module.export = saveUser;