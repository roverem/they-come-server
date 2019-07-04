const WebSocket = require('ws')
const { GdBuffer } = require('@gd-com/utils')
const { v4 } = require('uuid')
const process = require('./process')
const Player = require('./player')

const wss = new WebSocket.Server({ port: 8080 });

const DT = 1 / 5;

setup();

setInterval(() => {
  update(DT);
  

  /*for (let id in GAMES) {
      GAMES[id].update(DT);

      if (ticks++ % 10 === 0) {
          if (GAMES[id]) {
              GAMES[id].emit();
          }
      }
  }*/
}, DT * 1000);

function update(dt){
  for (let player in this.players){
    this.players[player].update();
  }
}

function setup(){
  this.players = {};
}

function createPlayer(ws, uuid){
  console.log(`[${uuid}] Connected`)
  // send is uuid
  this.players[uuid] = new Player(ws, uuid );

  let num_players = Object.keys(this.players).length;
  
  let uuidPacket = new GdBuffer()
  uuidPacket.putU16(num_players)
  uuidPacket.putString(uuid)
  ws.send(uuidPacket.getBuffer())

  ws.on('message', (message) => {
    let recieve = new GdBuffer(Buffer.from(message))

    const type = recieve.getU16()
    console.log(`[${uuid}] << Recieve packet code`, type)
    if (process.hasOwnProperty(type)) {
      //process[`${type}`](uuid, ws, recieve.getBuffer())
      process[type](uuid, ws, recieve.getBuffer())
    } else {
      console.log(`[${uuid}] << Unknow packet code`, type)
    }
  })

}

wss.on('connection', ws => {
  
  let uuid = v4()
  createPlayer(ws, uuid)
  
  ws.on('close', ()=>{
    console.log("close")
    console.log(this.players);
    console.log(uuid);
    delete this.players[uuid] 
  })
})

wss.on('close', ws => {
  console.log(ws)
})

