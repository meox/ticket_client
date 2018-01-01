import {Socket, LongPoller} from "phoenix"

class App {

  static init(){
    console.log("Hello");
    let socket = new Socket("ws://127.0.0.1:4000/socket", {
      logger: ((kind, msg, data) => {
        if (kind !== "receive")
          console.log(`${kind}: ${msg}`, data)
      })
    })

    socket.connect()

    socket.onOpen( ev => {
      console.log("OPEN")
    })

    socket.onError( ev => console.log("ERROR", ev) )
    socket.onClose( e => console.log("CLOSE", e))

    var chan = socket.channel("tickets:lobby", {})
    chan.join().receive("ignore", () => console.log("auth error"))
               .receive("ok", () => console.log("join ok"))

    chan.onError(e => console.log("something went wrong", e))
    chan.onClose(e => console.log("channel closed", e))

    chan.on("ticket", msg => {
      console.log("ticket received: ", msg.data)
    })

    return chan
  }
}

export default App
