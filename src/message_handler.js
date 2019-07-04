const { GdBuffer } = require('@gd-com/utils')
const process = require('./process')

export function _on_player_message(wsocket, uuid, player, message){

    let recieve = new GdBuffer(Buffer.from(message));
    
    const type = recieve.getU16();
    console.log("received a packet code: ", type, "from: ", uuid);

    if (process.hasOwnProperty(type)){
        process[type](uuid, wsocket, recieve.getBuffer());
    }else{
        console.log("unknown packet code", type, "from ", uuid);
    }
}