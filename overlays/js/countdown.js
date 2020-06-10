// Variables
var countdown = 300; // seconds
var countdownInterval;

// Utils
setTitle = function (title) {
  console.log(`Setting title to ${title}`);
  document.getElementById("title").innerHTML = title;
  Cookies.set("title", title, { sameSite: "lax" });
};

setTimerText = function (message) {
  document.getElementById("timer").innerHTML = message;
};

startCountdown = function () {
  countdownInterval = setInterval(function () {
    countdown -= 1;
    let minutes = Math.floor(countdown / 60);
    let seconds = countdown % 60;
    if (countdown >= 0) {
      setTimerText(`starts in ${minutes} minutes and ${seconds} seconds`);
    } else {
      setTimerText(`is starting`);
      clearInterval(countdownInterval);
      anime({
        targets: "#timer",
        opacity: 0,
        loop: true,
        easing: "linear",
        duration: 1000,
        direction: "alternate",
      });
    }
  }, 1000);
};

// Events
document.addEventListener("DOMContentLoaded", (event) => {
  let title = Cookies.get("title");
  if (title) {
    setTitle(title);
  }
});

overlay.on("Connected", (data) => {
  setTimerText(`Waiting for stream to start`);
});

overlay.on("Error", (data) => {
  setTimerText(data.error);
});

overlay.on("SetTitle", (data) => {
  setTitle(data.title);
});

obs.on("StreamStarted", (data) => {
  startCountdown();
});
