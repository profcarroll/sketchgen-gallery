let ants = [];
let tunnels = [];
let backgroundTexture;
let fft;
let amplitude;

function setup() {
  createCanvas(400, 400);
  backgroundTexture = createGraphics(width, height);
  generateBackground();
  for (let i = 0; i < 20; i++) {
    ants.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      size: random(2, 4),
      speed: random(0.5, 2)
    });
  }
  for (let i = 0; i < 50; i++) {
    tunnels.push({
      x: random(width),
      y: random(height),
      w: random(10, 50),
      h: random(10, 50),
      angle: random(TWO_PI)
    });
  }
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
}

function draw() {
  image(backgroundTexture, 0, 0);
  for (let tunnel of tunnels) {
    push();
    translate(tunnel.x, tunnel.y);
    rotate(tunnel.angle);
    fill(30, 20, 10);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, tunnel.w, tunnel.h);
    pop();
  }
  for (let ant of ants) {
    ant.x += ant.vx * ant.speed;
    ant.y += ant.vy * ant.speed;
    if (ant.x < 0 || ant.x > width) ant.vx *= -1;
    if (ant.y < 0 || ant.y > height) ant.vy *= -1;
    fill(0);
    noStroke();
    ellipse(ant.x, ant.y, ant.size);
  }
}

function generateBackground() {
  backgroundTexture.noiseDetail(2, 0.5);
  backgroundTexture.loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let n = noise(x * 0.01, y * 0.01) * 255;
      let c = color(n, n * 0.8, n * 0.6);
      backgroundTexture.set(x, y, c);
    }
  }
  backgroundTexture.updatePixels();
}

function mousePressed() {
  userStartAudio();
  fft.setInput(this);
}
