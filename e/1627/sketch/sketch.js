let glassShapes = [];
let timeOfDay = 0;
const colors = [
  [255, 100, 100],   // Dawn - cool reds
  [255, 200, 100],   // Morning - warm oranges
  [255, 255, 150],   // Noon - bright yellows
  [255, 150, 100],   // Afternoon - warm oranges
  [200, 100, 200],   // Twilight - purples
  [100, 100, 200]    // Night - cool blues
];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create stained glass shapes with more geometric complexity
  for (let i = 0; i < 80; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let w = random(40, 150);
    let h = random(40, 150);
    let rot = random(TWO_PI);
    let c = color(
      random(80, 220),
      random(80, 220),
      random(80, 220),
      random(180, 240)
    );
    glassShapes.push({x, y, w, h, rot, c});
  }
}

function draw() {
  // Update time of day (simulates 24-hour cycle)
  timeOfDay += 0.0003;
  
  // Background with subtle gradient
  let bg = lerpColor(color(10, 10, 30), color(30, 30, 60), sin(timeOfDay * 0.5) * 0.5 + 0.5);
  background(bg);
  
  // Draw stained glass shapes
  for (let shape of glassShapes) {
    push();
    translate(shape.x, shape.y);
    rotate(shape.rot);
    
    // Create a polygon shape with random points
    let points = [];
    let numPoints = floor(random(4, 8));
    for (let i = 0; i < numPoints; i++) {
      let angle = map(i, 0, numPoints, 0, TWO_PI);
      let r = random(shape.w * 0.3, shape.h * 0.5);
      points.push({
        x: cos(angle) * r,
        y: sin(angle) * r
      });
    }
    
    fill(shape.c);
    beginShape();
    for (let p of points) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw light beams that sweep across the structure
  let beamCount = 12;
  for (let i = 0; i < beamCount; i++) {
    let angle = map(i, 0, beamCount, 0, TWO_PI) + timeOfDay * 0.4;
    let x = cos(angle) * width/3;
    let y = sin(angle) * height/3;
    
    // Get color based on time of day
    let colorIndex = floor(timeOfDay * 0.3) % colors.length;
    let c1 = color(colors[colorIndex][0], colors[colorIndex][1], colors[colorIndex][2], 80);
    let c2 = color(255, 255, 255, 0);
    
    // Draw radial gradient
    push();
    translate(x, y);
    for (let j = 0; j < 6; j++) {
      let alpha = map(j, 0, 5, 100, 0);
      let r = map(j, 0, 5, 0, 400);
      
      // Create a gradient fill
      drawingContext.globalCompositeOperation = 'lighten';
      drawingContext.fillStyle = `rgba(255, 255, 255, ${alpha / 255})`;
      ellipse(0, 0, r * 2, r * 2);
    }
    pop();
  }
  
  // Add a subtle time-of-day color overlay
  let overlayColor = lerpColor(
    color(255, 100, 100, 0),
    color(100, 100, 200, 30),
    sin(timeOfDay * 0.2) * 0.5 + 0.5
  );
  fill(overlayColor);
  rect(-width/2, -height/2, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
