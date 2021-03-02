const express = require('express');
const router = express.Router();
const deviceModel = require('../models/platform/position');
const getPosition = data => {
    let dataArray = data.split('*');
    let contentArray = dataArray[3].split(',');
    let information = [];
    for (let i = 18; i < contentArray.length-2; i ++) {
        information.push(contentArray[i]);
    }
    let str = information.join(',');
    information = null;
    return {
        manufacture: dataArray[0],
        deviceId: dataArray[1],
        contentLength: dataArray[2],
        typeId: contentArray[0],
        model: {
            manufacture: dataArray[0],
            deviceId: dataArray[1],
            date: contentArray[1],
            time: contentArray[2],
            isValid: contentArray[3],
            latitudeCharacter: contentArray[5],
            latitude: contentArray[4],
            longitudeCharacter: contentArray[7],
            longitude: contentArray[6],
            speed: contentArray[8],
            direction: contentArray[9],
            altitude: contentArray[10],
            satelliteNumber: contentArray[11],
            gsmSignal: contentArray[12],
            battery: contentArray[13],
            pedometer: contentArray[14],
            tumblingTimes: contentArray[15],
            terminalStatus: contentArray[16],
            baseStationNumbers: contentArray[17],
            baseStationInformation: str,
            wifiNumbers: contentArray[contentArray.length - 2],
            positionAccuracy: contentArray[contentArray.length - 1],
        }
    }
};
const getData = data => {
    let dataArray = data.split("*");
    let contentArray = dataArray[3].split(',');
    return {
        deviceId: dataArray[1],
        contentLength: dataArray[2],
        typeId: contentArray[0],
        content: contentArray[1],
        model: {
            manufacture: dataArray[0],
            deviceId: dataArray[1],
        }
    }
};
const setData = (device, typeId) => {
    let data = '';
    switch (typeId) {
        case 'UPLOAD': data = device.interval;
            break;
        case 'CENTER': data = device.centerNumber;
            break;
        case 'PW': data = device.password;
            break;
        default:
    }
    return device.manufacture + '*' + device.deviceId + '*' + device.deviceId + '*' + typeId + ',' + data;
};
const net = require('net');
const server = net.createServer(function(connection) {
    console.log('client connected');
    connection.on('data', function(rawdata) {
        console.log('data is received:', rawdata.toString());
        let data = getData(rawdata.toString());
        if (data.typeId === 'LK') {
            const response = data.manufacture + '*' + data.deviceId + '*0002*LK';
            connection.write(response);
            updateDatabase(data);
        }
        else if (data.typeId === 'UD') {
            updateDatabase(getPosition(rawdata.toString()));
        }
    });
    connection.on('end', function() {
        console.log('connection closed');
    });
    connection.pipe(connection);
});
//define which port to listen
server.listen(1200, function() {
    console.log('server is listening');
});

//Update data in database
router.put('/manage', (req, res) => {
    const deviceId = req.body.deviceId;
    const data = req.body;
    const type = req.body.typeId;
    let connect = net.connect({port: 1200}, ()=>{
        connect.write(setData(data, type))
    });

    deviceModel.findOneAndUpdate({deviceId},data)
        .then(data => {
            res.send({status: 0, data: {data}})
        })
        .catch(error => {
            console.error('Error', error);
            res.send({status: 1, msg: 'Error'})
        })
});

//getData from database
router.get('/manage/list', (req, res) => {
    const deviceId = req.query.deviceId;
    deviceModel.find({deviceId})
        .then(data => {
                res.send({status: 0, data: {data}})
            })
        .catch(error => {
            console.error('Error', error);
            res.send({status: 1, msg: 'Error'})
        })
});

//update database based on device send data
const updateDatabase = data => {
    deviceModel.findOne({deviceId: data.deviceId})
        .then(device => {
            // if device exist
            if (device) {
                deviceModel.findOneAndUpdate({deviceId: data.deviceId}, data.model)
                    .then(oldUser => {
                        console.log('success updated')
                    })
            } else { // add a new data
                return deviceModel.create(data.model)
                    .then(()=>{
                        // return
                        console.log( 'Added a new device!')
                    })
            }
        })
        .catch(error => {
            console.error('Error', error);
        });
};

module.exports = router;