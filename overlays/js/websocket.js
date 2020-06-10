/* https://github.com/Palakis/obs-websocket/blob/4.x-current/docs/generated/protocol.md */

class Overlay {
  constructor(obs) {
    this.obs = obs;
    this.callbacks = {};
    this.obs.on("BroadcastCustomMessage", this.processMessage);
  }

  on(method, callback) {
    if (method in this.callbacks) {
      this.callbacks[method].push(callback);
    } else {
      this.callbacks[method] = [callback];
    }
  }

  runCallbacks(method, data) {
    if (method in this.callbacks) {
      for (let i = 0; i < this.callbacks[method].length; i++) {
        this.callbacks[method][i](data);
      }
    }
  }

  processMessage(data) {
    if (data.realm === "overlay") {
      overlay.runCallbacks(data.data.method, data.data);
    }
  }

  send(method, data) {
    data.method = method;
    this.obs.send("BroadcastCustomMessage", { realm: "overlay", data: data });
  }
}

const obs = new OBSWebSocket();
const overlay = new Overlay(obs);

obs
  .connect({ address: "localhost:4444" })
  .then(() => {
    obs.send("SetHeartbeat", { enable: false });
    overlay.processMessage({ realm: "overlay", data: { method: "Connected" } });
  })
  .catch((err) => {
    console.log(`${err.error} Unable to connect to OBS websocket.`);
    overlay.processMessage({
      realm: "overlay",
      data: { method: "Error", error: "Unable to connect to OBS websocket." },
    });
  });

obs.on("Heartbeat", (data) => {
  console.log("Recieved heartbeat");
});

overlay.on("Connected", (data) => {
  console.log("Overlay connected");
});
