import http from 'http';
import path from "path";

import express from 'express';
import mqtt from 'mqtt';

import {
    ACState,
    Device,
    FanType, Feeds, MailboxState,
    ModeType,
    TCL_MAX_TEMP,
    TCL_MIN_TEMP,
    TCLFanType,
    TCLModeType
} from "./types";
import {exec} from "child_process";


const mqttClient = mqtt.connect('mqtt://io.adafruit.com', {
    port: 1883,
    username: 'DrSmrtnik',
    password: 'mqttpassword'
});

const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);


app.use(express.static(path.join(__dirname, '..', 'dist', 'remote-control')));
app.get('/', (req, res) => res.sendFile(__dirname));

const PORT = process.env.PORT || 3000;
let devices: Device[] = [];

server.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
let startedListening: boolean = false;
io.on('connection', (socket) => {
    const command = "curl -H \"X-AIO-Key: aio_gjKi34GOt7cbiGoCRf8gJkXVwLht\" https://io.adafruit.com/api/v2/DrSmrtnik/feeds/";

    exec(command, function (error, stdout, stderr) {
        const feeds: Feeds[] = JSON.parse(stdout);

        devices = [];
        feeds.forEach(value => {
            let data = value.name.split(',');
            if (data[1] != undefined) {
                devices.push(<Device>{
                    deviceName: data[0],
                    deviceType: data[1]
                });
                console.log(`DrSmrtnik/f/${data[0]}Response`)
                mqttClient.subscribe(`DrSmrtnik/f/${data[0]}Response`);
            }
        });

        io.emit('devices', devices);//on connection get devices

        if (error !== null) {
            console.log('exec error: ' + error);
        }

    });

    socket.on('getDeviceState', (deviceName: string) => {
        console.log('Request device state from ' + deviceName);
        mqttClient.publish(`DrSmrtnik/f/${deviceName}Response/get`, 'get');
    });

    socket.on('sendDeviceState', (msg) => {
        // TODO function to map state to protocol!
        console.log('Sending device state CONTROL!');
        msg.state.mode = TCLModeType[ModeType[msg.state.mode]];
        msg.state.fan = TCLFanType[FanType[msg.state.fan]];
        if (msg.state.temp > TCL_MAX_TEMP) {
            msg.state.temp = 31;
        } else if (msg.state.temp < TCL_MIN_TEMP) {
            msg.state.temp = 16;
        }
        console.log(msg.state);
        mqttClient.publish(`DrSmrtnik/f/${msg.deviceName}Control`, JSON.stringify(msg.state));
    });


});

mqttClient.on('connect', () => {
    console.log('Connected to MQTT!');

    mqttClient.on('message', ((topic, payload) => {
        console.log("TOPIC: ", topic);
        console.log("PAYLOAD: ", payload.toString());
        startedListening = true;
        const responseRegex = new RegExp("^[a-zA-Z0-9\/]*Response$");
        const controlRegex = new RegExp("^[a-zA-Z0-9\/]*Control$");

        switch (true) {
            case responseRegex.test(topic) === true:
                console.log("Getting device state from " + topic);
                if (topic.includes('AC')) {
                    const msg: ACState = JSON.parse(payload.toString());
                    msg.mode = ModeType[TCLModeType[msg.mode]];
                    msg.fan = FanType[TCLFanType[msg.fan]];
                    console.log(msg);
                    // msg.state.fan = TCLFanType[FanType[msg.state.fan]];
                    io.emit(topic.split('/').pop(), JSON.stringify(msg));// DEVICE STATE
                } else {
                    const msg: MailboxState = JSON.parse(payload.toString());
                    io.emit(topic.split('/').pop(), JSON.stringify(msg));
                }
                break;
            case controlRegex.test(topic) === true: //DALI TREBA?
                console.log('control!'); //AC1Control, -> AC1 Response from INO device
                break;
            default:
                console.log('default!');
                break;
        }
    }));
});

mqttClient.on('error', (error) => {
    console.log('ERROR on mqtt Clint' + error);
});
