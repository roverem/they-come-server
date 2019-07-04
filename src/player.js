const { GdBuffer } = require('@gd-com/utils')

export class Player {
    constructor(ws, uuid){
        this.ws = ws;
        this.uuid = uuid;
    }

    update(dt){
        console.log(this.uuid, "update");

        let uuidPacket = new GdBuffer()
        uuidPacket.putU16(500)
        uuidPacket.putString("world_info: no info yet")
        this.ws.send(uuidPacket.getBuffer())
    }
}
