let stripes = [];
const numStripes = 15;
const speed = 0.002;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize stripes with random properties
  for (let i = 0; i < numStripes; i++) {
    stripes.push({
      angle: random(TWO_PI),
      speed: random(0.001, 0.005),
      width: random(200, 400),
      hue: random(360),
      amplitude: random(50, 150),
      frequency: random(0.01, 0.03)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  // Draw each stripe as a warped plane
  for (let i = 0; i < stripes.length; i++) {
    const s = stripes[i];
    
    push();
    translate(width/2, height/2);
    rotate(s.angle + frameCount * s.speed);
    
    // Create a dynamic warp effect using sine waves
    const points = [];
    const segments = 50;
    
    for (let j = 0; j <= segments; j++) {
      const t = map(j, 0, segments, -s.width/2, s.width/2);
      const y = sin(t * s.frequency + frameCount * 0.01) * s.amplitude;
      points.push({x: t, y: y});
    }
    
    // Draw the warped stripe
    noStroke();
    fill(s.hue, 80, 90, 0.7);
    beginShape();
    for (let j = 0; j < points.length; j++) {
      vertex(points[j].x, points[j].y);
    }
    
    // Close the shape with a reverse path
    for (let j = points.length - 1; j >= 0; j--) {
      vertex(-points[j].x, points[j].y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Occasionally shift directions to create lattice-like structures
  if (frameCount % 300 === 0) {
    for (let i = 0; i < stripes.length; i++) {
      stripes[i].angle += random(-0.2, 0.2);
      stripes[i].hue = (stripes[i].hue + 10) % 360;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
