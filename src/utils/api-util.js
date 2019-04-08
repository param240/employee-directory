import { apiURL } from '../config/api-config';
import axios from 'axios';

export function post(url, body, succesCallback, failureCallback) {
  axios.post(apiURL + url, body).then(succesCallback).catch(failureCallback);
}

export function get(url, succesCallback, failureCallback) {
  axios.get(apiURL + url).then(succesCallback).catch(failureCallback);
}

export function getProfilepic(callback) {
  post('profilepic', {}, (response) => {
    callback(null, response.data.result)
  }, (err) => {
    callback(err)
  });
}

export function getEmployeeInfo(employeeId, callback) {
  const body = {
    employeeId
  }
  post('employeeinfo', body, (response) => {
    callback(null, response.data.result);
  }, (err) => {
    if (err && err.response) {
      callback(err, err.response.data);
    } else if (err) {
      callback(err);
    }
  });
}

export function getEmployees(searchParam, callback) {
  const body = {
    searchParam
  }
  post('searchemployee', body, (response) => {
    callback(null, response.data.result);
  }, (err) => {
      callback(err);
  });
}

export function uploadPicture(imageData, callback) {
  const body = {
    imageData
  }
  var directoryUser = localStorage.getItem('directoryUser');
  if (directoryUser) {
    directoryUser = JSON.parse(directoryUser);
    body['employeeId'] = directoryUser['EMPLOYEE ID'];
  }
  post('uploadpicture', body, (response) => {
    callback(null, response.data.result);
  }, (err) => {
    if (err && err.response) {
      callback(err, err.response.data);
    } else if (err) {
      callback(err);
    }
  });
}