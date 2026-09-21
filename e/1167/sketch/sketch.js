let particles = [];
let dustParticles = [];
let peaks = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create mountain peaks
  for (let i = 0; i < 20; i++) {
    peaks.push({
      x: random(-width/2, width/2),
      y: height/4,
      z: random(-300, 300),
      size: random(100, 300),
      height: random(200, 500)
    });
  }

  // Create snow particles
  for (let i = 0; i < 2000; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(1, 3)
    });
  }

  // Create mineral dust particles
  for (let i = 0; i < 500; i++) {
    dustParticles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(0.5, 2),
      hue: random(10, 40) // Warm mineral tones
    });
  }
}

function draw() {
  background(220, 10, 95); // Cold sky with subtle blue tint

  // Camera position for panoramic view
  let time = millis() / 5000;
  camera(0, -height/4, height, 0, 0, 0, 0, 1, 0);

  // Draw mountains
  noStroke();
  for (let peak of peaks) {
    push();
    translate(peak.x, peak.y, peak.z);
    fill(220, 5, 90); // Pale blue-white snow
    sphere(peak.size/2, 8, 4);
    pop();
  }

  // Draw snow particles (foreground)
  stroke(220, 10, 95);
  strokeWeight(1);
  beginShape(POINTS);
  for (let p of particles) {
    vertex(p.x, p.y, p.z);
  }
  endShape();

  // Draw mineral dust streaks
  noStroke();
  for (let d of dustParticles) {
    fill(d.hue, 80, 90, 0.5);
    push();
    translate(d.x, d.y, d.z);
    sphere(d.size, 3, 2);
    pop();
  }

  // Add subtle color gradients
  blendMode(LIGHTEST);
  noStroke();
  fill(240, 10, 85, 0.1);
  rect(-width/2, -height/2, width, height);
  blendMode(BLEND);
}
