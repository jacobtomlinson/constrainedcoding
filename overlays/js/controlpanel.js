console.log("control panel");

overlay.on("Connected", (data) => {
  obs.send("GetSceneList").then((data) => {
    console.log(`${data.scenes.length} Available Scenes!`);
    data.scenes.forEach((scene) => {
      console.log(scene.name);
    });
  });
});

updateTitle = function () {
  let title = document.getElementById("streamTitle").value;
  overlay.send("SetTitle", { title: title });
};

document.getElementById("streamTitle").addEventListener("change", updateTitle);
