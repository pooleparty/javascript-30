const timeNodes = document.querySelectorAll("[data-time]");

const totalSeconds = Array.from(timeNodes).reduce((totalSeconds, curr) => {
  const [seconds, minutes, hours = 0] = curr.dataset.time
    .split(":")
    .reverse()
    .map(parseFloat);

  totalSeconds += seconds + minutes * 60 + hours * 3600;
  return totalSeconds;
}, 0);

let secondsLeft = totalSeconds;
const hours = Math.floor(secondsLeft / 3600);
secondsLeft = secondsLeft % 3600;
const minutes = Math.floor(secondsLeft / 60);
secondsLeft = secondsLeft % 60;

console.log('Hours:', hours, 'Minutes:', minutes, 'Seconds:', secondsLeft);
