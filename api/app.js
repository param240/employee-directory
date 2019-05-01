const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
var employeeUtil = require('./util/employee-util');
var pictureUtil = require('./util/picture-util');
var environment = require('./environment');

const app = express();
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));

var corsOptions = {
  origin: ['http://localhost:3000'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.get('/api/alive', function (req, res) {
  res.status(200).json({ status: 'SUCCESS' });
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

// To authenticate user through active directory
app.post('/api/authenticate', function (req, res) {
    console.log('auth')
  const emailId = req.body.emailId;
  const password = req.body.password;
  if (!emailId || !password) {
      res.status(400).json({
          error: 'Please ensure Email Id and Password are set.',
      });
      return;
  }
  employeeUtil.validateAndFetchEmployee(emailId, password, function (err, employee) {
      if (err) {
          res.status(400).json({ error: err.message });
      } else {
          res.status(200).json({ status: 'SUCCESS', result : {user: employee} });
      }
  });
});

// To get employee data
app.post('/api/employeeinfo', function (req, res) {
  const employeeId = req.body.employeeId;
  if (!employeeId) {
      res.status(400).json({
          error: 'Please ensure Employee Id is set.',
      });
      return;
  }
  employeeUtil.getEmployeeInfo(employeeId, function (err, result) {
      if (err) {
          var errorObj = {
            error: err.message,
            errorMessage: result
          }
          res.status(400).json(errorObj);
      } else {
          res.status(200).json({ status: 'SUCCESS', result });
      }
  });
});


// To search an Employee
app.post('/api/searchemployee', function (req, res) {
    const searchParam = req.body.searchParam;
    if (!searchParam) {
        res.status(400).json({
            error: 'Please ensure searchParam is set.',
        });
        return;
    }
    employeeUtil.findEmployee(searchParam, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ status: 'SUCCESS', result });
        }
    });
  });

// To upload a picture
app.post('/api/uploadpicture', function (req, res) {
    const imageData = req.body.imageData;
    const employeeId = req.body.employeeId;
    if (!imageData || !employeeId) {
        res.status(400).json({
            error: 'Please ensure Image Data and Employee Id are set.',
        });
        return;
    }
    pictureUtil.uploadPicture(employeeId, imageData, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ status: 'SUCCESS', result });
        }
    });
  });

const port = environment.port;
const host = environment.hostServer;
app.listen(port, host, () => console.log(`Listening on port ${port}`));