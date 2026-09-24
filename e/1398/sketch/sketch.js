let spheres = [];
let polygons = [];
let fft;
let amplitude;
let mic;
let isAudioStarted = false;
let audioLevel = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize audio
  mic = new p5.AudioIn();
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
  
  // Create initial shapes
  for (let i = 0; i < 30; i++) {
    spheres.push({
      x: random(width),
      y: random(height),
      size: random(10, 60),
      hue: random(360),
      speed: random(0.5, 2),
      direction: random(TWO_PI),
      pulse: random(1, 3)
    });
  }
  
  for (let i = 0; i < 15; i++) {
    polygons.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      sides: floor(random(3, 7)),
      hue: random(360),
      speed: random(0.1, 0.5),
      rotation: random(TWO_PI),
      pulse: random(0.5, 2)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  if (isAudioStarted) {
    audioLevel = amplitude.getLevel();
    let freq = fft.analyze();
    
    // Update spheres based on audio
    for (let s of spheres) {
      s.size += sin(frameCount * s.speed) * s.pulse;
      s.size = constrain(s.size, 5, 100);
      s.hue += audioLevel * 20;
      if (s.hue > 360) s.hue -= 360;
    }
    
    // Update polygons based on audio
    for (let p of polygons) {
      p.size += sin(frameCount * p.speed) * p.pulse;
      p.size = constrain(p.size, 15, 150);
      p.rotation += audioLevel * 0.2;
      p.hue += audioLevel * 10;
      if (p.hue > 360) p.hue -= 360;
    }
  }
  
  // Draw and update spheres
  for (let s of spheres) {
    push();
    translate(s.x, s.y);
    noStroke();
    fill(s.hue, 100, 100, 0.8);
    
    let size = s.size + sin(frameCount * s.speed) * s.pulse * 5;
    ellipse(0, 0, size, size);
    pop();
    
    // Move spheres
    s.x += cos(s.direction) * s.speed;
    s.y += sin(s.direction) * s.speed;
    
    if (s.x < 0 || s.x > width) s.direction = PI - s.direction;
    if (s.y < 0 || s.y > height) s.direction = -s.direction;
  }
  
  // Draw and update polygons
  for (let p of polygons) {
    push();
    translate(p.x, p.y);
    rotate(p.rotation);
    noStroke();
    fill(p.hue, 100, 100, 0.7);
    
    beginShape();
    for (let i = 0; i < p.sides; i++) {
      let angle = map(i, 0, p.sides, 0, TWO_PI);
      let x = cos(angle) * p.size;
      let y = sin(angle) * p.size;
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
    
    // Move polygons
    p.x += sin(frameCount * 0.01) * 1.5;
    p.y += cos(frameCount * 0.01) * 1.5;
    
    if (p.x < -100 || p.x > width + 100) p.x = random(width);
    if (p.y < -100 || p.y > height + 100) p.y = random(height);
  }
}

function mousePressed() {
  if (!isAudioStarted) {
    userStartAudio();
    mic.start();
    fft.setInput(mic);
    amplitude.setInput(mic);
    isAudioStarted = true;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
