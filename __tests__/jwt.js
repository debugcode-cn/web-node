var jwt = require('jsonwebtoken');
const secretOrPublicKey = 'secret';
var token = jwt.sign({
    data: 'foobar'
}, secretOrPublicKey, { expiresIn: '3s' });

console.log(token);

setTimeout(function () {
    try {
        const check = jwt.verify(token, secretOrPublicKey);
        console.log('check', check.name);
    } catch (err) {
        // err
        console.log('err', err.name);
    }
}, 5000);