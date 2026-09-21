let points = [];
let x = 0;
let y = 0;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  noStroke();
}

function draw() {
  background(0);

  // Generate EKG-like pattern
  if (points.length > width) {
    points.shift();
  }

  // Add new point with EKG pattern
  let heartRate = 0.02;
  let spike = sin(time * heartRate) * 100;
  let noise = random(-5, 5);
  let pulse = sin(time * heartRate * 3) * 20;
  
  y = height / 2 + spike + pulse + noise;
  points.push({x: x, y: y});

  // Draw the neon line
  beginShape();
  for (let i = 0; i < points.length; i++) {
    let point = points[i];
    let alpha = map(i, 0, points.length, 0, 255);
    
    // Create glowing effect with multiple layers
    fill(180, 255, 255, alpha * 0.7);
    vertex(point.x, point.y);
  }
  endShape();

  // Move the line from left to right
  x += 2;
  time++;
  
  if (x > width + 100) {
    x = -100;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
