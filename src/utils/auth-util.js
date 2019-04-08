import * as apiUtil from './api-util';

export function authenticateUser(user, callback) {
    const body = {
        emailId: user.emailId,
        password: user.password
    }
    apiUtil.post('authenticate', body, (response) => {
        const user = JSON.stringify(response.data.result.user);
        localStorage.setItem('directoryUser', user);
        callback(null, response.data.result.user)
    }, (err) => {
        callback(err)
    })
}

export function isAuthenticated() {
    var currentUser = localStorage.getItem('directoryUser');
    if (currentUser) {
        currentUser = JSON.parse(currentUser);
        if (currentUser['EMAIL ID']) {
            return true;
        }
    }
    return false;
}