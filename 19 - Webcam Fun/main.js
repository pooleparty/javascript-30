const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(e => {
      console.error("Oh No", e);
    });
}

function paintToCanvas() {
  const { videoHeight: height, videoWidth: width } = video;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    // mess with them
    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    // pixels = greenScreen(pixels);
    pixels = pixelate(ctx, width, height);

    // ghosting effect
    // ctx.globalAlpha = 0.1;

    // put them back
    // ctx.putImageData(pixels, 0, 0);
  }, 64);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; //red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; //green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; //red
    pixels.data[i + 100] = pixels.data[i + 1]; //green
    pixels.data[i - 150] = pixels.data[i + 2]; //blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  [...document.querySelectorAll(".rgb input")].forEach(input => {
    levels[input.name] = input.value;
  });

  for (let i = 0; i < pixels.data.length; i += 4) {
    red = pixels.data[i + 0];
    blue = pixels.data[i + 1];
    green = pixels.data[i + 2];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
}

function rgba(r, g, b, a) {
  if (g == undefined) {
    return (
      "rgb(" +
      clamp(Math.round(r), 0, 255) +
      ", " +
      clamp(Math.round(r), 0, 255) +
      ", " +
      clamp(Math.round(r), 0, 255) +
      ")"
    );
  } else if (b == undefined) {
    return (
      "rgba(" +
      clamp(Math.round(r), 0, 255) +
      ", " +
      clamp(Math.round(r), 0, 255) +
      ", " +
      clamp(Math.round(r), 0, 255) +
      ", " +
      clamp(g, 0, 1) +
      ")"
    );
  } else if (a == undefined) {
    return (
      "rgba(" +
      clamp(Math.round(r), 0, 255) +
      ", " +
      clamp(Math.round(g), 0, 255) +
      ", " +
      clamp(Math.round(b), 0, 255) +
      ", 1)"
    );
  } else {
    return (
      "rgba(" +
      clamp(Math.round(r), 0, 255) +
      ", " +
      clamp(Math.round(g), 0, 255) +
      ", " +
      clamp(Math.round(b), 0, 255) +
      ", " +
      clamp(a, 0, 1) +
      ")"
    );
  }
}

function pixelate(ctx, width, height, sampleSize = 8) {
  let pixels = ctx.getImageData(0, 0, width, height);
  for (let y = 0; y < height; y += sampleSize) {
    for (let x = 0; x < width; x += sampleSize) {
      const pos = (x + y * width) * 4;
      const red = pixels.data[pos + 0];
      const green = pixels.data[pos + 1];
      const blue = pixels.data[pos + 2];
      const alpha = pixels.data[pos + 3];

      // for (let j = 0; j < sampleSize; j++) {
      //   for (let i = 0; i < sampleSize; i++) {
      //     const subpos = (pos + i + j * width) * 4;
      //     pixels.data[subpos + 0] = red;
      //     pixels.data[subpos + 1] = green;
      //     pixels.data[subpos + 2] = blue;
      //   }
      // }
      ctx.fillStyle = rgba(red, blue, green, alpha);
      ctx.fillRect(x, y, sampleSize, sampleSize);
    }
  }

  return pixels;
}

function takePhoto() {
  // play the sound
  snap.currentTime = 0;
  snap.play();

  // take the data out of the canvas
  const data = canvas.toDataURL("image/jpeg");
  console.log(data);
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "handsome");
  link.innerHTML = `<img src="${data}" alt="Plz" />`;
  strip.insertBefore(link, strip.firstChild);
}

getVideo();

video.addEventListener("canplay", paintToCanvas);
