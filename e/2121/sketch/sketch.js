let bands = [];
let numBands = 150;
let tension = 0.02;
let snapThreshold = 0.8;
let snapSpeed = 0.05;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  for (let i = 0; i < numBands; i++) {
    bands.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      length: random(30, 80),
      angle: random(TWO_PI),
      segments: [],
      tension: random(0.01, 0.05),
      snapPhase: random(TWO_PI),
      snapped: false,
      snapProgress: 0,
      color: color(random(20, 40), 80, 90)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  for (let i = 0; i < bands.length; i++) {
    let band = bands[i];
    
    // Update band tension
    if (!band.snapped) {
      band.snapPhase += band.tension;
      let pulse = sin(band.snapPhase);
      
      if (abs(pulse) > snapThreshold) {
        band.snapped = true;
        band.snapProgress = 0;
      }
    } else {
      // Animate the snap
      band.snapProgress += snapSpeed;
      if (band.snapProgress >= 1) {
        band.snapped = false;
        band.snapProgress = 0;
        band.angle += random(-0.2, 0.2); // Randomize direction after snap
      }
    }
    
    // Draw the rubber band
    push();
    translate(band.x, band.y);
    rotate(band.angle);
    
    // Draw segments
    let segmentLength = band.length / 10;
    let segments = [];
    
    for (let j = 0; j < 10; j++) {
      let segX = j * segmentLength;
      let segY = sin(j * 0.5 + band.snapPhase) * (band.snapped ? 
        map(band.snapProgress, 0, 1, 0, 20) : 
        map(abs(sin(band.snapPhase)), 0, 1, 0, 5));
      
      segments.push({x: segX, y: segY});
    }
    
    // Draw band with tension visualization
    stroke(band.color);
    strokeWeight(2);
    noFill();
    
    beginShape();
    for (let j = 0; j < segments.length; j++) {
      let s = segments[j];
      vertex(s.x, s.y);
    }
    endShape();
    
    // Draw tension points
    fill(band.color);
    noStroke();
    for (let j = 0; j < segments.length; j++) {
      let s = segments[j];
      ellipse(s.x, s.y, 3);
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
