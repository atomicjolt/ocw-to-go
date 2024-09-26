"use strict";

async function init() {
  const worker = await activateWorker();

  navigator.serviceWorker.addEventListener("message", event => {
    console.log("The Main Thread Received a Message", event);
  });

  activateCourseButtons(worker)
}

function activateWorker() {
  return new Promise((resolve) => {
    navigator.serviceWorker.register("/worker.js");
    navigator.serviceWorker.ready.then(registration => {
      resolve(registration.active);
    });
  });
}

function activateCourseButtons(worker) {
  const buttons = document.querySelectorAll(".course-download");
  console.log(buttons)
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      console.log("The Button Was Clicked", button.dataset,worker);
      worker.postMessage({ type: "downloadCourse", path: button.dataset.coursePath });
    });
  });
}

init();
