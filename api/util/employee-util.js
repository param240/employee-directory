var async = require('async');
var activeDirectoryUtil = require('./activedirectory-util');
var xlsxUtil = require('./xlsx-util');
var pictureUtil = require('./picture-util');

var environment = require('../environment').env;
var appConfig;
if (environment === 'live') {
    appConfig = require('../config/live/config').appConfig;
} else if (environment === 'test') {
    appConfig = require('../config/test/config').appConfig;
}

function validateAndFetchEmployee(emailId, password, callback) {
    function authenticateUser(callback) {
        activeDirectoryUtil.authenticate(emailId, password, callback)
    }
    function fetchEmployee(callback) {
        xlsxUtil.fetchEmployeeByField('EMAIL ID', emailId, callback);
    }
    async.waterfall([
        authenticateUser,
        fetchEmployee
    ], callback)
}

function getEmployeeInfo(employeeId, callback) {
    function fetchEmployee(callback) {
        xlsxUtil.fetchEmployeeByField('EMPLOYEE ID', employeeId, function (err, employee) {
            if (err) {
                var errorMessage = "Couldn't find the Employee";
                callback(err, errorMessage);
                return;
            }
            var result = {
                name: employee['FIRST NAME'] + ' ' + employee['LAST NAME'],
                designation: employee['POSITION'],
                employeeId,
                group: employee['GROUP'],
                team: employee['GROUP'],
                location: employee['LOCATION'],
                employeeSince: employee['ENTRY DATE'],
                emailId: employee['EMAIL ID'].toLowerCase(),
                extension: employee['EXTENSION'] || '',
                bloodGroup: employee['BLOOD GROUP'],
                birthday: employee['BIRTHDAY']
            }
            const managerEmailId = employee['REPORTING MANAGER EMAIL ID'].toLowerCase();
            pictureUtil.getEmployeePic(employeeId, 'profile', function (err, pic) {
                if (err) {
                    var errorMessage = "Couldn't fetch Employee's profile picture";
                    callback(err, errorMessage);
                    return;
                }
                var picBase64 = new Buffer(pic).toString('base64');
                result['pic'] = picBase64;
                callback(null, result, managerEmailId);
            });
        });
    }

    function fetchManager(result, managerEmailId, callback) {
        xlsxUtil.fetchEmployeeByField('EMAIL ID', managerEmailId, function (err, employee) {
            if (err) {
                var errorMessage = "Couldn't find the Employee's Manager";
                callback(err, errorMessage);
                return;
            }
            result['manager'] = {
                name: employee['FIRST NAME'] + ' ' + employee['LAST NAME'],
                employeeId: employee['EMPLOYEE ID']
            }
            pictureUtil.getEmployeePic(result.manager.employeeId, 'thumbnail', function (err, pic) {
                if (err) {
                    var errorMessage = "Couldn't fetch Employee Manager's profile picture";
                    callback(err, errorMessage);
                    return;
                }
                var picBase64 = new Buffer(pic).toString('base64');
                result['manager']['pic'] = picBase64;
                callback(null, result);
            });
        });
    }

    function fetchReportees(result, callback) {
        xlsxUtil.fetchDirectReportees(result.emailId, function (err, reportees) {
            if (err) {
                callback(err);
                return;
            }
            result['reportees'] = [];
            if (reportees.length > 0) {
                function handleGetPicture(reportee, callback) {
                    var emp = {
                        name: reportee['FIRST NAME'] + ' ' + reportee['LAST NAME'],
                        employeeId: reportee['EMPLOYEE ID']
                    }
                    pictureUtil.getEmployeePic(emp.employeeId, 'thumbnail', function (err, pic) {
                        if (err) {
                            var errorMessage = "Couldn't fetch Employee Reportees's profile picture";
                            callback(err, errorMessage);
                            return;
                        }
                        var picBase64 = new Buffer(pic).toString('base64');
                        emp['pic'] = picBase64;
                        callback(null, emp);
                    });
                }

                var funcs = reportees.map(function (reportee) {
                    return async.apply(handleGetPicture, reportee)
                });

                async.parallel(funcs, function (err, data) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    result['reportees'] = data;
                    callback(null, result);
                })

            } else {
                callback(null, result);
            }
        })
    }

    async.waterfall([
        fetchEmployee,
        fetchManager,
        fetchReportees
    ], callback)
}

function findEmployee(searchParam, callback) {
    xlsxUtil.findEmployee(searchParam, function (err, employees) {
        if (err) {
            callback(err);
            return;
        }
        const result = {
            employees
        }
        callback(null, result)
    })
}

module.exports = {
    validateAndFetchEmployee: validateAndFetchEmployee,
    getEmployeeInfo: getEmployeeInfo,
    findEmployee: findEmployee
}