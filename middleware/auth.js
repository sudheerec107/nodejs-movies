const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ msg: 'Autherization denied' });
        } else {
            jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
                if (err || !verified || !verified.id) {
                    return res.status(401).json({ msg: 'Autherization denied, token verify failed' });
                } else {
                    req.user = verified.id;
                    next();
                }
            });
            
        }
};

module.exports = auth;
