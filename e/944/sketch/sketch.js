let fibers = [];
let knots = [];
let canvas;
let fft;
let amplitude;

function setup() {
  canvas = createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize fibers
  for (let i = 0; i < 5000; i++) {
    fibers.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      hue: random(360),
      sat: random(20, 80),
      bri: random(40, 90),
      speed: random(0.001, 0.005),
      angle: random(TWO_PI),
      noiseOffset: random(1000)
    });
  }
  
  // Initialize knots
  for (let i = 0; i < 200; i++) {
    knots.push({
      x: random(width),
      y: random(height),
      size: random(10, 30),
      hue: random(360),
      sat: random(50, 100),
      bri: random(30, 70)
    });
  }
  
  // Audio setup
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
  userStartAudio();
}

function draw() {
  background(0, 0, 0, 0.02);
  
  // Update and display fibers
  for (let i = 0; i < fibers.length; i++) {
    let f = fibers[i];
    
    // Animate fiber
    f.x += sin(f.angle) * f.speed * 10;
    f.y += cos(f.angle) * f.speed * 10;
    f.angle += noise(f.noiseOffset) * 0.05 - 0.025;
    f.noiseOffset += 0.01;
    
    // Wrap around edges
    if (f.x < 0) f.x = width;
    if (f.x > width) f.x = 0;
    if (f.y < 0) f.y = height;
    if (f.y > height) f.y = 0;
    
    // Draw fiber
    fill(f.hue, f.sat, f.bri, 0.8);
    ellipse(f.x, f.y, f.size);
  }
  
  // Display knots
  for (let i = 0; i < knots.length; i++) {
    let k = knots[i];
    fill(k.hue, k.sat, k.bri, 0.9);
    ellipse(k.x, k.y, k.size);
  }
  
  // Audio-reactive effect
  let levels = fft.analyze();
  let vol = amplitude.getLevel();
  if (vol > 0.01) {
    for (let i = 0; i < 50; i++) {
      let x = random(width);
      let y = random(height);
      let size = map(vol, 0, 0.3, 5, 50);
      fill(random(360), 100, 100, 0.2);
      ellipse(x, y, size);
    }
  }
}

function mousePressed() {
  // Start audio on first click
  userStartAudio();
}

function mouseDragged() {
  // Create ripple effect from mouse position
  let rippleSize = 100;
  let rippleStrength = 5;
  
  for (let i = 0; i < fibers.length; i++) {
    let f = fibers[i];
    let d = dist(mouseX, mouseY, f.x, f.y);
    
    if (d < rippleSize) {
      let force = map(d, 0, rippleSize, rippleStrength, 0);
      f.x += (f.x - mouseX) * force * 0.01;
      f.y += (f.y - mouseY) * force * 0.01;
      
      // Increase saturation and brightness
      f.sat = min(100, f.sat + 20);
      f.bri = min(100, f.bri + 20);
    }
  }
}
