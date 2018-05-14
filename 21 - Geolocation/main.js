const arrow = document.querySelector('.arrow');
const speed = document.querySelector('.speed');

navigator.geolocation.watchPosition((data) => {
  console.log(data);
  speed.textContent = data.coords.speed;
  arrow.style.transform = `rotate(${data.coords.heading})`;
}, (err) => {
  console.error(err);
  alert('HEY! YOU GOTTA ALLOW THAT TO HAPPEN')
});
