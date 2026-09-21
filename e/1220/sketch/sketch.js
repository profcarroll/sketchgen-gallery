let particles = [];
let knots = [];
let fft;
let amplitude;
let isAudioStarted = false;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create particles
  for (let i = 0; i < 2000; i++) {
    particles.push({
      pos: p5.Vector.random3D().mult(random(200, 400)),
      vel: p5.Vector.random3D().mult(random(0.1, 0.5)),
      size: random(2, 6),
      hue: random(360)
    });
  }
  
  // Create knots
  for (let i = 0; i < 100; i++) {
    knots.push({
      pos: p5.Vector.random3D().mult(random(150, 350)),
      rot: random(TWO_PI),
      size: random(10, 30)
    });
  }
  
  // Setup audio
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
}

function draw() {
  background(0, 0, 10);
  
  // Camera motion
  let time = millis() * 0.0002;
  camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0);
  rotateX(sin(time * 0.3) * 0.2);
  rotateY(time * 0.1);
  
  // Draw particles
  strokeWeight(1);
  noFill();
  beginShape(POINTS);
  for (let p of particles) {
    let pos = p.pos.copy();
    pos.add(p.vel);
    
    if (pos.mag() > 500) {
      pos.normalize().mult(500);
      p.vel.mult(-1);
    }
    
    p.pos = pos;
    
    stroke(p.hue, 80, 90, 0.8);
    vertex(pos.x, pos.y, pos.z);
  }
  endShape();
  
  // Draw knots
  noStroke();
  for (let k of knots) {
    push();
    translate(k.pos.x, k.pos.y, k.pos.z);
    rotateX(k.rot + time * 0.5);
    rotateY(time * 0.3);
    
    fill(k.rot * 10 % 360, 70, 80, 0.9);
    box(k.size);
    pop();
  }
  
  // Update audio
  if (isAudioStarted) {
    let vol = amplitude.getLevel();
    let bass = fft.getEnergy('bass');
    
    // Modify particle motion based on audio
    for (let p of particles) {
      p.vel.add(
        sin(time * 2 + p.pos.x * 0.01) * vol * 0.5,
        cos(time * 3 + p.pos.y * 0.01) * vol * 0.5,
        sin(time * 1.5 + p.pos.z * 0.01) * vol * 0.5
      );
      
      // Scale based on bass
      p.size = map(bass, 0, 255, 2, 10);
    }
  }
}

function mousePressed() {
  if (!isAudioStarted) {
    userStartAudio();
    isAudioStarted = true;
  }
}
