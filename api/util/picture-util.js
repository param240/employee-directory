var sharp = require('sharp');
sharp.cache(false);

function getPictureName(employeeId, type) {
    var name = "ATL-";
    if (employeeId < 10) {
        name += "000" + employeeId;
    } else if (employeeId < 100) {
        name += "00" + employeeId;
    } else if (employeeId < 1000) {
        name += "0" + employeeId;
    } else {
        name += employeeId;
    }

    if (type === 'profile') {
        name += 'employee.jpg';
    } else {
        name += 'search.jpg';
    }
    return name;
}

function getEmployeePic(employeeId, type, callback) {
    var path = __dirname + '/../images/uploaded/' + employeeId + '.jpg';
    var width;
    var height;
    if (type === 'profile') {
        width = 400;
        height = 400;
    } else if (type === 'search-thumbnail') {
        width = 100;
        height = 100;
    } else {
        width = 50;
        height = 50;
    }
    sharp(path)
        .toBuffer()
        .then(function (data) {
            callback(null, data);
            return;
        })
        .catch(function (err) {
            if (err.message === 'Input file is missing or of an unsupported image format') {
                var picName = getPictureName(employeeId, type);
                var defaultPath = __dirname + '/../images/pics/' + picName;
                sharp(defaultPath)
                    .toBuffer()
                    .then(function (data) {
                        callback(null, data);
                        return;
                    })
                    .catch(function (err) {
                        if (err.message === 'Input file is missing or of an unsupported image format') {
                            var avatarPath = __dirname + '/../images/pics/minions.jpg';
                            sharp(avatarPath)
                                .toBuffer()
                                .then(function (data) {
                                    callback(null, data);
                                    return;
                                })
                                .catch(function (err) {
                                    callback(err);
                                    return;
                                });
                        }  else {
                            callback(err);
                            return;
                        }
                    });
            } else {
                callback(err);
                return;
            }
        });
}

function uploadPicture(employeeId, imageData, callback) {
    const img = imageData.split("data:image/png;base64,").pop();
    var imageBuffer = Buffer.from(img, 'base64');
    var path = __dirname + '/../images/uploaded/' + employeeId + '.jpg';
    sharp(imageBuffer)
        .toFile(path, (err, info) => {
            if (err) {
                callback(err);
                return;
            };
            callback(null);
        });
}

module.exports = {
    getEmployeePic: getEmployeePic,
    uploadPicture: uploadPicture
}