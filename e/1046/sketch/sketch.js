let quakes = [];
let maxQuakes = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noFill();
  
  // Create initial quakes
  for (let i = 0; i < 20; i++) {
    quakes.push(new Quak());
  }
}

function draw() {
  background(0, 0, 5);
  
  // Update and display quakes
  for (let i = quakes.length - 1; i >= 0; i--) {
    quakes[i].update();
    quakes[i].show();
    
    if (quakes[i].finished()) {
      quakes.splice(i, 1);
    }
  }
  
  // Add new quakes over time
  if (frameCount % 30 === 0 && quakes.length < maxQuakes) {
    quakes.push(new Quak());
  }
}

function mousePressed() {
  // Resume audio context on user gesture
  userStartAudio();
  
  // Create quake at mouse position
  let q = new Quak(mouseX, mouseY, true);
  quakes.push(q);
  
  // Play sound
  let oscillator = new p5.Oscillator();
  oscillator.setType('sine');
  oscillator.freq(220);
  oscillator.amp(0.1);
  oscillator.start();
  oscillator.stop(0.5);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Quak {
  constructor(x, y, large = false) {
    this.x = x || random(width);
    this.y = y || random(height);
    this.radius = large ? random(50, 150) : random(10, 50);
    this.maxRadius = this.radius * 5;
    this.diffuse = large ? random(0.5, 2) : random(0.2, 1);
    this.fade = 0;
    this.points = [];
    this.isLarge = large;
    
    // Generate points for the jagged effect
    let numPoints = int(this.radius / 5);
    for (let i = 0; i < numPoints; i++) {
      let angle = TWO_PI * i / numPoints;
      let noiseVal = noise(i * 0.1, frameCount * 0.01) * 0.5;
      let r = this.radius + noiseVal * 30;
      this.points.push({
        x: this.x + cos(angle) * r,
        y: this.y + sin(angle) * r,
        phase: random(TWO_PI)
      });
    }
  }
  
  update() {
    this.radius += this.diffuse;
    this.fade += 0.5;
  }
  
  show() {
    stroke(0, 100, 100, 100 - this.fade);
    strokeWeight(2);
    
    beginShape();
    for (let p of this.points) {
      let noiseVal = noise(p.x * 0.01, frameCount * 0.01 + p.phase) * 0.5;
      let x = p.x + (random(-10, 10) + noiseVal * 20);
      let y = p.y + (random(-10, 10) + noiseVal * 20);
      vertex(x, y);
    }
    endShape();
  }
  
  finished() {
    return this.radius > this.maxRadius || this.fade > 100;
  }
}
