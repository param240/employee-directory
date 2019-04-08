// var env = 'test';
var env = 'live';

var url;
if (env === 'live') {
    url = 'http://10.1.10.48:9000/api/';
} else if (env === 'test') {
    url = 'http://localhost:9000/api/';
}

export const apiURL = url;