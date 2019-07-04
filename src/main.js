const WebSocket = require('ws')
const { GdBuffer } = require('@gd-com/utils')
const { v4 } = require('uuid')
import { Player } from './player'
import {_on_player_message} from './message_handler.js'

const wss = new WebSocket.Server({ port: 8080 });

const players = {};

wss.on('connection', wsocket =>{
    let uuid = v4();
    players[uuid] = new Player(wsocket, uuid);
    
    let uuidPacket = new GdBuffer();
    let num_players = Object.keys(players).length;
    uuidPacket.putU16(num_players);
    uuidPacket.putString(uuid);
    wsocket.send(uuidPacket.getBuffer());

    wsocket.on('message', _on_player_message.bind(null, wsocket, uuid, players[uuid]))
    wsocket.on('close', ()=>{
        delete players[uuid];
    })
})

const DT = 1 / 5;

setInterval(
    () => {update(DT);}, 
    DT * 1000);


function update(dt){
    for (let player in players){
        players[player].update();
    }
}