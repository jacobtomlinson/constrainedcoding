console.log("control panel");

overlay.on("Connected", (data) => {
  obs.send("GetSceneList").then((data) => {
    console.log(`${data.scenes.length} Available Scenes!`);
    data.scenes.forEach((scene) => {
      console.log(scene.name);
    });
  });
});

document.getElementById("streamTitleButton").addEventListener("click", () => {
  let title = document.getElementById("streamTitle").value;
  overlay.send("SetTitle", { title: title });
  Cookies.set("streamTitle", title, { sameSite: "lax" });
});

document.getElementById("reloadAllButton").addEventListener("click", () => {
  overlay.send("Reload", {});
});

overlay.on("WebsocketError", (data) => {
  let address = window.prompt(
    "Please enter websocket address",
    Cookies.get("websocket") || "localhost:4444"
  );
  Cookies.set("websocket", address, { sameSite: "lax" });
  location.reload();
});

document.addEventListener("DOMContentLoaded", (event) => {
  let title = Cookies.get("streamTitle");
  if (title) {
    document.getElementById("streamTitle").value = title;
  }
});