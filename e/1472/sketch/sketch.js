let waves = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize jellyfish body with multiple wave layers
  for (let i = 0; i < 5; i++) {
    waves.push({
      radius: random(200, 400),
      speed: random(0.005, 0.02),
      amplitude: random(10, 50),
      frequency: random(0.01, 0.03),
      hue: random(180, 240), // Deep blue to cyan
      alpha: random(0.2, 0.6)
    });
  }
}

function draw() {
  background(0, 0, 5, 0.95); // Dark with slight fade
  
  time += 0.01;
  
  // Draw each wave layer
  for (let i = 0; i < waves.length; i++) {
    let w = waves[i];
    
    push();
    translate(width/2, height/2);
    
    noFill();
    stroke(w.hue, 80, 90, w.alpha);
    strokeWeight(2);
    
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.05) {
      let x = cos(a) * (w.radius + sin(time * w.speed + a * w.frequency) * w.amplitude);
      let y = sin(a) * (w.radius + sin(time * w.speed + a * w.frequency) * w.amplitude);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Add floating particles for bioluminescent effect
  for (let i = 0; i < 100; i++) {
    let angle = time + i * 0.1;
    let radius = 150 + sin(time * 0.5 + i) * 50;
    let x = width/2 + cos(angle) * radius;
    let y = height/2 + sin(angle) * radius;
    
    let hue = (time * 20 + i * 3) % 360;
    fill(hue, 100, 100, 0.5);
    noStroke();
    ellipse(x, y, 2, 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
