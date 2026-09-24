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
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create stained glass shapes
  for (let i = 0; i < 150; i++) {
    let x = random(width);
    let y = random(height);
    let w = random(30, 100);
    let h = random(30, 100);
    let rot = random(TWO_PI);
    let c = color(
      random(50, 200),
      random(50, 200),
      random(50, 200),
      random(180, 220)
    );
    glassShapes.push({x, y, w, h, rot, c});
  }
}

function draw() {
  // Update time of day (simulates 24-hour cycle)
  timeOfDay += 0.0005;
  
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
    let numPoints = floor(random(3, 7));
    for (let i = 0; i < numPoints; i++) {
      let angle = map(i, 0, numPoints, 0, TWO_PI);
      let r = random(shape.w * 0.5, shape.h * 0.5);
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
    
    // Add a subtle highlight
    let highlight = color(red(shape.c), green(shape.c), blue(shape.c), 50);
    fill(highlight);
    beginShape();
    vertex(0, -shape.h * 0.3);
    vertex(shape.w * 0.2, -shape.h * 0.1);
    vertex(-shape.w * 0.2, -shape.h * 0.1);
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw light beams
  let beamCount = 10;
  for (let i = 0; i < beamCount; i++) {
    let angle = map(i, 0, beamCount, 0, TWO_PI) + timeOfDay * 0.5;
    let x = width / 2 + cos(angle) * 300;
    let y = height / 2 + sin(angle) * 300;
    
    // Get color based on time of day
    let colorIndex = floor(timeOfDay * 0.5) % colors.length;
    let c1 = color(colors[colorIndex][0], colors[colorIndex][1], colors[colorIndex][2], 100);
    let c2 = color(255, 255, 255, 0);
    
    // Draw radial gradient
    push();
    translate(x, y);
    for (let j = 0; j < 5; j++) {
      let alpha = map(j, 0, 4, 100, 0);
      let r = map(j, 0, 4, 0, 300);
      
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
    sin(timeOfDay * 0.3) * 0.5 + 0.5
  );
  fill(overlayColor);
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
