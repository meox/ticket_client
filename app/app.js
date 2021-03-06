import {Socket, LongPoller} from "phoenix"

class App {

  static init(){
    console.log("Hello");
    let socket = new Socket("ws://192.168.1.250:4000/socket", {
      logger: ((kind, msg, data) => {
        if (kind !== "receive")
          console.log(`${kind}: ${msg}`, data)
      })
    })

    socket.connect()

    socket.onOpen( ev => {
      console.log("OPEN")
    })

    socket.onError( ev => console.log("ERROR", ev))
    socket.onClose( e => console.log("CLOSE", e))

    var chan = socket.channel("tickets:lobby", {})
    chan.join().receive("ignore", () => console.log("auth error"))
               .receive("ok", () => console.log("join ok"))

    chan.onError(e => console.log("something went wrong", e))
    chan.onClose(e => console.log("channel closed", e))

    chan.on("ticket", msg => {
      console.log("recv: ", msg.data.length)
      for (let i = 0; i < msg.data.length; i++)
        console.log(msg.data[i])
    })

    chan.on("control", msg => {
        console.dir(msg)
    })

    return chan
  }
}

export default App
