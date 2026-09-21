let ants = [];
let tunnels = [];
let debris = [];
let fft;
let amplitude;
let audioContext;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create tunnels
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(30, 80);
    tunnels.push({
      x: x,
      y: y,
      size: size,
      angle: random(TWO_PI)
    });
  }
  
  // Create ants
  for (let i = 0; i < 20; i++) {
    ants.push({
      x: random(width),
      y: random(height),
      size: random(3, 6),
      speed: random(0.5, 1.5),
      angle: random(TWO_PI),
      carrying: random() > 0.7
    });
  }
  
  // Create debris
  for (let i = 0; i < 50; i++) {
    debris.push({
      x: random(width),
      y: random(height),
      size: random(1, 3)
    });
  }
  
  // Setup audio
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
}

function draw() {
  background(30, 20, 90);
  
  // Draw tunnels
  for (let tunnel of tunnels) {
    noStroke();
    fill(20, 10, 20);
    ellipse(tunnel.x, tunnel.y, tunnel.size * 2);
    
    stroke(15, 15, 30);
    strokeWeight(2);
    noFill();
    ellipse(tunnel.x, tunnel.y, tunnel.size);
  }
  
  // Draw debris
  for (let d of debris) {
    fill(40, 20, 70);
    noStroke();
    ellipse(d.x, d.y, d.size);
  }
  
  // Update and draw ants
  for (let ant of ants) {
    // Move ant
    ant.x += cos(ant.angle) * ant.speed;
    ant.y += sin(ant.angle) * ant.speed;
    
    // Bounce off edges
    if (ant.x < 0 || ant.x > width) ant.angle = PI - ant.angle;
    if (ant.y < 0 || ant.y > height) ant.angle = -ant.angle;
    
    // Randomly change direction
    if (random() < 0.02) {
      ant.angle += random(-0.5, 0.5);
    }
    
    // Draw ant body
    fill(0, 0, 10);
    noStroke();
    ellipse(ant.x, ant.y, ant.size);
    
    // Draw carrying object if any
    if (ant.carrying) {
      fill(40, 30, 60);
      ellipse(ant.x + cos(ant.angle) * ant.size,
               ant.y + sin(ant.angle) * ant.size,
               ant.size / 2);
    }
  }
  
  // Update FFT for audio visualization
  if (audioContext && audioContext.state === 'running') {
    let spectrum = fft.analyze();
    let vol = amplitude.getLevel();
    
    // Animate based on volume
    let hue = map(vol, 0, 0.5, 20, 60);
    background(hue, 20, 90);
  }
}

function mousePressed() {
  if (!audioContext) {
    userStartAudio();
    audioContext = getAudioContext();
  }
}
