const curl = require('curl');

exports.authorization = function(){
    let url = 'http://127.0.0.1:9000/testBasicAuthorization';
    let account = 'wlz';
    let password = '1:2';
    console.log('indexOf','wlz:1:2'.indexOf(':'))
    let authorization = Buffer.from(account + ':' + password,'utf-8').toString('base64');
    console.log('authorization',authorization);
    curl.get(url, {
        headers:{
            Authorization:' Basic ' + authorization
        }
    }, function(err, response, body) {
        console.log('err',err)
    });
}
exports.authorization();