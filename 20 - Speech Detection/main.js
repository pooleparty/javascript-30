import { ENOPROTOOPT } from "constants";

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new window.SpeechRecognition();
recognition.interimResults = true;

let p = document.createElement("p");

const words = document.querySelector(".words");
words.appendChild(p);

recognition.addEventListener("result", e => {
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join("");

  p.textContent = transcript;
  if (e.results[0].isFinal) {
    p = document.createElement("p");
    words.appendChild(p);
  }

  // if (transcript.includes('get the weather')) {
  //   console.log('Getting the weather');
  // }
});
recognition.addEventListener("end", recognition.start);

recognition.start();
