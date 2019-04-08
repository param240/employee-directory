var ActiveDirectory = require('activedirectory2');
var config = {
    url: 'ldap://10.1.10.11:389',
    baseDN: 'dc=ananthtech,dc=com'
}
var ad = new ActiveDirectory(config);

function authenticate(emailId, password, callback) {
    ad.authenticate(emailId, password, function (err, auth) {
        if (err) {
            callback(err);
            return;
        }
        if (auth) {
            callback(null);
            return;
        }
        else {
            callback(new Error('Authentication failed!'));
            return;
        }
    });
}

module.exports = {
    authenticate: authenticate
}