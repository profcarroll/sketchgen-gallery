let horseShapes = [];
let numShapes = 15;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize horse shapes with varying properties
  for (let i = 0; i < numShapes; i++) {
    horseShapes.push({
      x: random(width),
      y: random(height),
      size: random(30, 80),
      angle: random(TWO_PI),
      speed: random(0.02, 0.05),
      hue: random(20, 40), // Earth tones
      alpha: random(0.3, 0.7)
    });
  }
}

function draw() {
  background(0, 0, 10); // Dark background to enhance contrast
  
  time += 0.05;
  
  // Draw each horse silhouette
  for (let i = 0; i < horseShapes.length; i++) {
    let shape = horseShapes[i];
    
    // Update position and angle based on time
    shape.x += sin(time * shape.speed) * 2;
    shape.y += cos(time * shape.speed) * 2;
    shape.angle += sin(time * 0.01) * 0.05;
    
    // Keep shapes within canvas bounds
    if (shape.x < -50) shape.x = width + 50;
    if (shape.x > width + 50) shape.x = -50;
    if (shape.y < -50) shape.y = height + 50;
    if (shape.y > height + 50) shape.y = -50;
    
    // Draw flowing horse silhouette
    push();
    translate(shape.x, shape.y);
    rotate(shape.angle);
    
    noStroke();
    fill(shape.hue, 80, 90, shape.alpha);
    
    // Create a flowing, organic shape resembling a galloping horse
    beginShape();
    vertex(0, -shape.size * 0.3);
    bezierVertex(
      shape.size * 0.5, -shape.size * 0.1,
      shape.size * 0.7, shape.size * 0.2,
      shape.size * 0.3, shape.size * 0.5
    );
    bezierVertex(
      -shape.size * 0.2, shape.size * 0.6,
      -shape.size * 0.5, shape.size * 0.3,
      -shape.size * 0.4, -shape.size * 0.1
    );
    endShape(CLOSE);
    
    // Add a trail effect
    fill(shape.hue, 80, 90, shape.alpha * 0.2);
    ellipse(0, 0, shape.size * 0.5, shape.size * 0.3);
    
    pop();
  }
  
  // Add dynamic motion blur or trailing effect
  fill(0, 0, 0, 0.05); // Very light overlay for trail effect
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
