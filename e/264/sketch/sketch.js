let traces = [];
let path = [];
let palette = [];
let saturationBoost = 0;
let boostCenter;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 100);
  
  // Initialize palette with ambient colors
  for (let i = 0; i < 50; i++) {
    palette.push(color(random(20, 80), random(30, 70), random(60, 90)));
  }
  
  // Create initial traces
  for (let i = 0; i < 100; i++) {
    traces.push({
      points: [],
      color: random(palette),
      speed: random(0.005, 0.02),
      noiseStrength: random(0.01, 0.03),
      size: random(1, 3)
    });
  }
  
  // Initialize path
  for (let i = 0; i < 100; i++) {
    path.push({x: width/2, y: height/2});
  }
  
  boostCenter = {x: width/2, y: height/2};
}

function draw() {
  // Ambient background with slight color shift
  background(0, 0, 10);
  
  // Update and draw traces
  for (let i = 0; i < traces.length; i++) {
    let trace = traces[i];
    
    // Move trace points
    if (trace.points.length < 200) {
      trace.points.push({x: 0, y: 0});
    }
    
    // Update each point
    for (let j = 0; j < trace.points.length; j++) {
      let p = trace.points[j];
      
      // Noise-based movement
      let angle = noise(p.x * 0.002, p.y * 0.002, frameCount * trace.speed) * TWO_PI;
      let dx = cos(angle) * trace.noiseStrength;
      let dy = sin(angle) * trace.noiseStrength;
      
      // Apply movement
      p.x += dx;
      p.y += dy;
      
      // Keep within bounds
      if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
        p.x = random(width);
        p.y = random(height);
      }
    }
    
    // Draw trace
    noFill();
    stroke(trace.color);
    strokeWeight(trace.size);
    beginShape();
    for (let j = 0; j < trace.points.length; j++) {
      let p = trace.points[j];
      curveVertex(p.x, p.y);
    }
    endShape();
    
    // Occasionally change color
    if (frameCount % 100 === 0) {
      trace.color = random(palette);
    }
  }
  
  // Update path
  path.shift();
  path.push({x: mouseX, y: mouseY});
  
  // Check for intersection with three distinct forms
  let formIntersections = 0;
  let totalDistances = 0;
  
  for (let i = 0; i < traces.length; i++) {
    let trace = traces[i];
    for (let j = 0; j < path.length - 1; j++) {
      let p = path[j];
      for (let k = 0; k < trace.points.length; k++) {
        let t = trace.points[k];
        let d = dist(p.x, p.y, t.x, t.y);
        totalDistances += d;
        
        // If close enough to form
        if (d < 30) {
          formIntersections++;
          break;
        }
      }
    }
  }
  
  // Boost saturation when three forms are intersected
  if (formIntersections >= 3) {
    saturationBoost = min(saturationBoost + 0.05, 1);
  } else {
    saturationBoost *= 0.95;
  }
  
  // Apply color boost to all traces
  for (let i = 0; i < traces.length; i++) {
    let trace = traces[i];
    let newColor = color(
      hue(trace.color),
      saturation(trace.color) * (1 - saturationBoost) + 100 * saturationBoost,
      brightness(trace.color)
    );
    trace.color = newColor;
  }
  
  // Draw central path
  noFill();
  stroke(255, 80);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < path.length; i++) {
    curveVertex(path[i].x, path[i].y);
  }
  endShape();
  
  // Visual feedback of boost
  if (saturationBoost > 0.1) {
    noStroke();
    fill(255, 50);
    ellipse(mouseX, mouseY, 50 * saturationBoost);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
