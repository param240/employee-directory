var xlsx = require('xlsx');
var environment = require('../environment').env;
var async = require('async');
var pictureUtil = require('./picture-util');

var configPath;
if (environment === 'test') {
    configPath = '/../config/test/'
} else {
    configPath = '/../config/live/'
}
var employeeWorkbook = xlsx.readFile(__dirname + configPath + 'EmployeeDB.xlsx');
var employeeFirstWorksheet = employeeWorkbook.Sheets[employeeWorkbook.SheetNames[0]];
var employeeData = xlsx.utils.sheet_to_json(employeeFirstWorksheet);

function fetchEmployeeByField(fieldName, fieldValue, callback) {
    if (employeeData) {
        var employeeIndex = employeeData.findIndex((row) => {
            if (!row[fieldName]) {
                return false;
            }
            var value;
            if (fieldName === 'EMAIL ID' || fieldName === 'REPORTING MANAGER EMAIL ID') {
                value = row[fieldName].toLowerCase().trim();
                fieldValue = fieldValue.trim();
            } else {
                value = row[fieldName];
            }
            return value == fieldValue;
        })
        if (employeeIndex !== -1) {
            var employee = employeeData[employeeIndex];
            if (employee['EMAIL ID']) {
                employee['EMAIL ID'] = employee['EMAIL ID'].toLowerCase().trim();
            }
            if (employee['REPORTING MANAGER EMAIL ID']) {
                employee['REPORTING MANAGER EMAIL ID'] = employee['REPORTING MANAGER EMAIL ID'].toLowerCase().trim();
            }
            callback(null, employee);
        } else {
            callback(new Error("Couldn't find the User"))
        }
    } else {
        console.log('Error in reading XL Sheet');
        callback(new Error('Error in reading XL Sheet'))
    }
}

function fetchDirectReportees(emailId, callback) {
    if (employeeData) {
        var reportees = [];
        reportees = employeeData.filter(function (row) {
            if (row['REPORTING MANAGER EMAIL ID']) {
                return emailId === row['REPORTING MANAGER EMAIL ID'].toLowerCase();
            }
            return false;
        });
        callback(null, reportees);
    } else {
        console.log('Error in reading XL Sheet');
        callback(new Error('Error in reading XL Sheet'));
        return;
    }
}



function findEmployee(searchParam, callback) {
    if (employeeData) {
        searchParam = searchParam.toLowerCase().trim();
        const employees = employeeData.filter(function (row) {
            if (row['FIRST NAME']) {
                const fName = row['FIRST NAME'].toLowerCase();
                if (fName.includes(searchParam)) {
                    return true;
                }
            }
            if (row['LAST NAME']) {
                const lName = row['LAST NAME'].toLowerCase();
                if (lName.includes(searchParam)) {
                    return true;
                }
            }
            if (row['EMAIL ID']) {
                const emailId = row['EMAIL ID'].toLowerCase();
                if (emailId.includes(searchParam)) {
                    return true;
                }
            }
            if (row['GROUP']) {
                const group = row['GROUP'].toLowerCase();
                if (group.includes(searchParam)) {
                    return true;
                }
            }
            if (row['POSITION']) {
                const position = row['POSITION'].toLowerCase();
                if (position.includes(searchParam)) {
                    return true;
                }
            }
            if (row['EMPLOYEE ID']) {
                const employeeId = row['EMPLOYEE ID'].toString().toLowerCase();
                if (employeeId.includes(searchParam)) {
                    return true;
                }
            }
            return false;
        });

        function handleGetPicture(employee, callback) {
            var emp = {
                name: employee['FIRST NAME'] + ' ' + employee['LAST NAME'],
                employeeId: employee['EMPLOYEE ID'],
                emailId: employee['EMAIL ID'],
                group: employee['GROUP'],
                position: employee['POSITION']
            }
            pictureUtil.getEmployeePic(emp.employeeId, 'search-thumbnail', function (err, pic) {
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

        var funcs = employees.map(function (employee) {
            return async.apply(handleGetPicture, employee)
        });

        async.parallel(funcs, function (err, data) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, data);
        })
    } else {
        console.log('Error in reading XL Sheet');
        callback(new Error('Error in reading XL Sheet'));
        return;
    }

}

module.exports = {
    fetchEmployeeByField: fetchEmployeeByField,
    fetchDirectReportees: fetchDirectReportees,
    findEmployee: findEmployee
}