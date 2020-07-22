const writelog = require('writelog');
const errorHandler = (error, req, res, next) => {
    if (!error) {
        next();
    } else {
        writelog('catch error', error);
        res.status(500).send({msg: 'Internal server Error' });
    }
}

module.exports = errorHandler;
