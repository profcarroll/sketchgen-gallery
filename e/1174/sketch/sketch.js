let ripple;
let shockwave;
let ring;
let audioReady = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  ripple = [];
  shockwave = [];
  ring = [];
}

function draw() {
  background(0);
  
  // Draw rings
  for (let i = ring.length - 1; i >= 0; i--) {
    let r = ring[i];
    r.lifetime -= 0.02;
    r.alpha = map(r.lifetime, 0, 1, 0, 50);
    fill(255, r.alpha);
    ellipse(r.x, r.y, r.size, r.size);
    if (r.lifetime <= 0) {
      ring.splice(i, 1);
    }
  }
  
  // Draw shockwaves
  for (let i = shockwave.length - 1; i >= 0; i--) {
    let s = shockwave[i];
    s.radius += s.speed;
    s.alpha = map(s.radius, 0, width, 255, 0);
    stroke(255, s.alpha);
    noFill();
    ellipse(s.x, s.y, s.radius * 2, s.radius * 2);
    if (s.radius > width) {
      shockwave.splice(i, 1);
    }
  }
  
  // Draw ripples
  for (let i = ripple.length - 1; i >= 0; i--) {
    let r = ripple[i];
    r.radius += r.speed;
    r.alpha = map(r.radius, 0, width, 255, 0);
    stroke(255, r.alpha);
    noFill();
    ellipse(r.x, r.y, r.radius * 2, r.radius * 2);
    if (r.radius > width) {
      ripple.splice(i, 1);
    }
  }
}

function mousePressed() {
  if (!audioReady) {
    userStartAudio();
    audioReady = true;
  }
  
  // Create ripple
  ripple.push({
    x: mouseX,
    y: mouseY,
    radius: 0,
    speed: 2,
    alpha: 255
  });
  
  // Create chime sound
  let osc = new p5.Oscillator('sine');
  osc.freq(440);
  osc.amp(0.3);
  osc.start();
  osc.stop(millis() + 200);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
