const jwt = require('jsonwebtoken')
const UserSchema = require('../models/users.model')


module.exports = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).send('invalid token.');
        let decode = jwt.verify(token, 'asdf')
        const id = UserSchema.findOne(decode._id);
        if (!id) {
            return res.status(401).send('invalid token no user found.');
        }
        req.auth = decode
        next()
    } catch (error) {
        console.log(new Date());
        
        console.log(error)

        res.status(500).send(error)
    }


}
