let patches = [];
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

  // Initialize patches in a grid pattern
  let cols = 12;
  let rows = 8;
  let patchWidth = width / cols;
  let patchHeight = height / rows;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      patches.push({
        x: x * patchWidth + patchWidth / 2,
        y: y * patchHeight + patchHeight / 2,
        size: random(30, 60),
        angle: random(TWO_PI),
        colorIndex: floor(random(colors.length)),
        speed: random(0.001, 0.005),
        targetColorIndex: floor(random(colors.length)),
        shapeType: floor(random(3)), // 0 = square, 1 = triangle, 2 = hexagon
        waveOffset: (x + y * cols) * 0.3,
        waveSpeed: random(0.005, 0.01)
      });
    }
  }
}

function draw() {
  time += 0.005;

  // Background transition
  let bgIndex = (time * 0.2) % colors.length;
  background(colors[floor(bgIndex)]);

  // Draw patches
  for (let i = 0; i < patches.length; i++) {
    let p = patches[i];
    
    // Update color slowly
    p.colorIndex = lerp(p.colorIndex, p.targetColorIndex, 0.015);
    if (abs(p.colorIndex - p.targetColorIndex) < 1) {
      p.targetColorIndex = floor(random(colors.length));
    }

    push();
    translate(p.x, p.y);
    
    // Apply wave motion to position
    let waveY = sin(time * p.waveSpeed + p.waveOffset) * 5;
    let waveX = cos(time * p.waveSpeed + p.waveOffset) * 5;
    translate(waveX, waveY);

    rotate(p.angle + time * p.speed);
    
    // Draw a geometric patch
    fill(colors[floor(p.colorIndex)]);
    
    if (p.shapeType === 0) {
      // Square
      rectMode(CENTER);
      rect(0, 0, p.size, p.size * 0.6);
      
      // Add stitching lines
      stroke(255, 100);
      strokeWeight(1);
      line(-p.size/2, 0, p.size/2, 0);
      line(0, -p.size/3, 0, p.size/3);
    } else if (p.shapeType === 1) {
      // Triangle
      triangle(0, -p.size/2, -p.size/2, p.size/2, p.size/2, p.size/2);
      
      // Add stitching lines
      stroke(255, 100);
      strokeWeight(1);
      line(0, -p.size/2, 0, p.size/2); 
    } else {
      // Hexagon
      beginShape();
      for (let j = 0; j < 6; j++) {
        let angle = TWO_PI * j / 6;
        let x = cos(angle) * p.size/2;
        let y = sin(angle) * p.size/2;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      // Add stitching lines
      stroke(255, 100);
      strokeWeight(1);
      line(-p.size/2, 0, p.size/2, 0);
    }

    pop();

    // Change size slowly with wave motion
    let waveSize = sin(time * 0.3 + p.waveOffset) * 5;
    p.size += waveSize * 0.1;
    p.size = constrain(p.size, 25, 70);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
