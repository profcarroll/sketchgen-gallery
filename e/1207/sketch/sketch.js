let ripple;
let shockwave;
let ring;
let audioContext;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  ripple = [];
  shockwave = [];
  ring = [];
}

function draw() {
  background(220, 5, 95);
  
  // Update and display ripples
  for (let i = ripple.length - 1; i >= 0; i--) {
    let r = ripple[i];
    r.radius += r.speed;
    r.alpha -= 0.01;
    
    if (r.alpha <= 0) {
      ripple.splice(i, 1);
    } else {
      fill(r.hue, r.sat, r.bri, r.alpha);
      ellipse(r.x, r.y, r.radius * 2);
    }
  }
  
  // Update and display shockwaves
  for (let i = shockwave.length - 1; i >= 0; i--) {
    let s = shockwave[i];
    s.radius += s.speed;
    s.alpha -= 0.02;
    
    if (s.alpha <= 0) {
      shockwave.splice(i, 1);
    } else {
      fill(s.hue, s.sat, s.bri, s.alpha);
      ellipse(s.x, s.y, s.radius * 2);
    }
  }
  
  // Update and display rings
  for (let i = ring.length - 1; i >= 0; i--) {
    let r = ring[i];
    r.alpha -= 0.005;
    
    if (r.alpha <= 0) {
      ring.splice(i, 1);
    } else {
      fill(r.hue, r.sat, r.bri, r.alpha);
      ellipse(r.x, r.y, r.radius * 2);
    }
  }
}

function mousePressed() {
  // Start audio on first click
  if (!audioContext) {
    userStartAudio();
    audioContext = getAudioContext();
  }
  
  let x = mouseX;
  let y = mouseY;
  
  // Create ripple
  ripple.push({
    x: x,
    y: y,
    radius: 0,
    speed: 2,
    alpha: 1,
    hue: 240,
    sat: 80,
    bri: 90
  });
  
  // Create shockwave
  shockwave.push({
    x: x,
    y: y,
    radius: 0,
    speed: 5,
    alpha: 0.7,
    hue: 240,
    sat: 80,
    bri: 90
  });
  
  // Create ring
  ring.push({
    x: x,
    y: y,
    radius: 100,
    alpha: 0.5,
    hue: 240,
    sat: 80,
    bri: 90
  });
  
  // Play chime sound
  let osc = new p5.Oscillator();
  osc.setType('sine');
  osc.freq(300 + random(-50, 50));
  osc.amp(0.1);
  osc.start();
  osc.stop(millis() + 500);
}
