let modules = [];
let time = 0;
let colors = [];
let pathPoints = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Precompute color palette for day cycle
  colors = [];
  for (let i = 0; i < 256; i++) {
    let t = i / 255;
    let r, g, b;

    // Interpolate through HSV to RGB
    if (t < 0.25) {
      r = 0;
      g = t * 4 * 255;
      b = 255;
    } else if (t < 0.5) {
      r = 0;
      g = 255;
      b = (1 - t * 2) * 255;
    } else if (t < 0.75) {
      r = (t * 4 - 2) * 255;
      g = 255;
      b = 0;
    } else {
      r = 255;
      g = (1 - (t - 0.75) * 4) * 255;
      b = 0;
    }

    colors.push(color(r, g, b));
  }

  // Generate a meandering river path
  let segments = 100;
  let amplitude = min(width, height) * 0.3;
  let frequency = 0.02;
  
  for (let i = 0; i < segments; i++) {
    let t = i / (segments - 1);
    let x = t * width;
    let y = height/2 + sin(t * TWO_PI * 2 + time) * amplitude * 0.5;
    
    // Add some variation to make it more organic
    y += sin(t * TWO_PI * 4 + time * 0.7) * amplitude * 0.1;
    
    pathPoints.push({x, y});
  }

  // Initialize structural modules along the river path
  let cols = 8;
  let rows = 6;
  let moduleWidth = width / cols;
  let moduleHeight = height / rows;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Distribute modules along the path
      let index = map(x + y * cols, 0, cols * rows - 1, 0, pathPoints.length - 1);
      let point = pathPoints[floor(index)];
      
      modules.push({
        x: point.x,
        y: point.y,
        width: moduleWidth * 0.8,
        height: moduleHeight * 0.8,
        angle: random(TWO_PI),
        colorIndex: floor(random(colors.length)),
        speed: random(0.001, 0.005),
        targetColorIndex: floor(random(colors.length)),
        waveOffset: (x + y * cols) * 0.3,
        waveSpeed: random(0.005, 0.01),
        shapeType: floor(random(4)), // 0 = square, 1 = triangle, 2 = hexagon, 3 = diamond
        ripplePhase: random(TWO_PI),
        pathIndex: index,
        originalX: point.x,
        originalY: point.y
      });
    }
  }
}

function draw() {
  time += 0.005;

  // Background transition
  let bgIndex = (time * 0.2) % colors.length;
  background(colors[floor(bgIndex)]);

  // Draw modules along the river path
  for (let i = 0; i < modules.length; i++) {
    let m = modules[i];
    
    // Update color slowly
    m.colorIndex = lerp(m.colorIndex, m.targetColorIndex, 0.015);
    if (abs(m.colorIndex - m.targetColorIndex) < 1) {
      m.targetColorIndex = floor(random(colors.length));
    }

    push();
    translate(m.x, m.y);
    
    // Apply wave motion to position along the path
    let waveY = sin(time * m.waveSpeed + m.waveOffset) * 3;
    let waveX = cos(time * m.waveSpeed + m.waveOffset) * 3;
    translate(waveX, waveY);

    rotate(m.angle + time * m.speed);
    
    // Draw a geometric module
    fill(colors[floor(m.colorIndex)]);
    
    // Ripple effect on module shape
    let ripple = sin(time + m.ripplePhase) * 0.2;
    let scale = 1 + ripple;

    if (m.shapeType === 0) {
      // Square with ripple
      rectMode(CENTER);
      rect(0, 0, m.width * scale, m.height * scale);
      
      // Add stitching lines
      stroke(255, 100);
      strokeWeight(1);
      line(-m.width/2, 0, m.width/2, 0);
      line(0, -m.height/2, 0, m.height/2);
    } else if (m.shapeType === 1) {
      // Triangle with ripple
      triangle(0, -m.height/2 * scale, -m.width/2 * scale, m.height/2 * scale, m.width/2 * scale, m.height/2 * scale);
      
      // Add stitching lines
      stroke(255, 100);
      strokeWeight(1);
      line(0, -m.height/2 * scale, 0, m.height/2 * scale); 
    } else if (m.shapeType === 2) {
      // Hexagon with ripple
      beginShape();
      for (let j = 0; j < 6; j++) {
        let angle = TWO_PI * j / 6;
        let x = cos(angle) * m.width/2 * scale;
        let y = sin(angle) * m.height/2 * scale;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      // Add stitching lines
      stroke(255, 100);
      strokeWeight(1);
      line(-m.width/2 * scale, 0, m.width/2 * scale, 0);
    } else {
      // Diamond with ripple
      beginShape();
      vertex(0, -m.height/2 * scale);
      vertex(m.width/2 * scale, 0);
      vertex(0, m.height/2 * scale);
      vertex(-m.width/2 * scale, 0);
      endShape(CLOSE);
      
      // Add stitching lines
      stroke(255, 100);
      strokeWeight(1);
      line(-m.width/2 * scale, 0, m.width/2 * scale, 0);
    }

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
