const mongoose = require('mongoose');
// data = 'manufacture * deviceId * contentLength * content'

const DeviceSchema = new mongoose.Schema({
    manufacture: {type: String, required: true},
    deviceId: {type: Number, required: true},
    date: {type: Number},
    time: {type: Number},
    isValid: {type: String, default: 'A'},
    latitudeCharacter: {type: String, default: 'N'},
    latitude: {type: Number},
    longitudeCharacter: {type: String, default: 'E'},
    longitude: {type: Number},
    speed: {type: Number},
    direction: {type: Number},
    altitude: {type: Number},
    satelliteNumber: {type: Number},
    gsmSignal: {type: Number},
    battery: {type: Number},
    pedometer: {type: Number},
    tumblingTimes: {type: Number},
    terminalStatus: {type: Number},
    baseStationNumbers: {type: Number},
    baseStationInformation: {type: String},
    wifiNumbers: {type: Number},
    positionAccuracy: {type: Number},
    centerNumber: {type: Number},
    interval: {type: Number},
    password: {type: String},
});

const DeviceModel = mongoose.model('device', DeviceSchema);

module.exports = DeviceModel;
