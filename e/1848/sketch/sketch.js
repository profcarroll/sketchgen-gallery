let modules = [];
let time = 0;
let colors = [];

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

  // Initialize structural modules in a grid
  let cols = 12;
  let rows = 10;
  let moduleWidth = width / cols;
  let moduleHeight = height / rows;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      modules.push({
        x: x * moduleWidth + moduleWidth/2,
        y: y * moduleHeight + moduleHeight/2,
        width: moduleWidth * 0.8,
        height: moduleHeight * 0.8,
        angle: (x + y) % 4 * PI/2, // Sharp angles
        colorIndex: floor(random(colors.length)),
        shapeType: floor(random(4)), // 0 = square, 1 = triangle, 2 = hexagon, 3 = diamond
        phase: (x + y) * 0.5,
      });
    }
  }
}

function draw() {
  time += 0.01;

  // Background transition
  let bgIndex = (time * 0.2) % colors.length;
  background(colors[floor(bgIndex)]);

  // Draw modules in a rigid grid pattern with sharp angles
  for (let i = 0; i < modules.length; i++) {
    let m = modules[i];
    
    push();
    translate(m.x, m.y);
    rotate(m.angle);
    
    // Draw a geometric module with sharp angles
    fill(colors[floor(m.colorIndex)]);
    
    if (m.shapeType === 0) {
      // Square
      rectMode(CENTER);
      rect(0, 0, m.width, m.height);
      
      // Add stitching lines
      stroke(255, 100);
      strokeWeight(1);
      line(-m.width/2, 0, m.width/2, 0);
      line(0, -m.height/2, 0, m.height/2);
    } else if (m.shapeType === 1) {
      // Triangle
      triangle(0, -m.height/2, -m.width/2, m.height/2, m.width/2, m.height/2);
      
      // Add stitching lines
      stroke(255, 100);
      strokeWeight(1);
      line(0, -m.height/2, 0, m.height/2); 
    } else if (m.shapeType === 2) {
      // Hexagon
      beginShape();
      for (let j = 0; j < 6; j++) {
        let angle = TWO_PI * j / 6;
        let x = cos(angle) * m.width/2;
        let y = sin(angle) * m.height/2;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      // Add stitching lines
      stroke(255, 100);
      strokeWeight(1);
      line(-m.width/2, 0, m.width/2, 0);
    } else {
      // Diamond
      beginShape();
      vertex(0, -m.height/2);
      vertex(m.width/2, 0);
      vertex(0, m.height/2);
      vertex(-m.width/2, 0);
      endShape(CLOSE);
      
      // Add stitching lines
      stroke(255, 100);
      strokeWeight(1);
      line(-m.width/2, 0, m.width/2, 0);
    }

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
