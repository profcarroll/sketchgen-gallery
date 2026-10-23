let veins = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noFill();
  
  // Create liquid crystal vein structure with overlapping planar fractures
  for (let i = 0; i < 80; i++) {
    veins.push({
      x: random(width),
      y: random(height),
      size: random(200, 600),
      angle: random(TWO_PI),
      speed: random(0.001, 0.003),
      hue: random(20, 40), // Monochromatic graphite tones
      segments: floor(random(3, 8)),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 100, 0.05); // Semi-transparent background for trail effect
  
  time += 0.01;
  
  // Draw veins as overlapping planar fractures
  for (let i = 0; i < veins.length; i++) {
    let v = veins[i];
    
    // Update vein parameters
    v.angle += v.speed;
    v.phase += 0.02;
    
    push();
    translate(v.x, v.y);
    rotate(v.angle);
    
    // Draw multiple overlapping fractures
    for (let j = 0; j < v.segments; j++) {
      let segmentAngle = v.angle + j * 0.5;
      let segmentSize = v.size * (1 - j * 0.1);
      
      // Create fracture-like geometric pattern
      beginShape();
      let points = floor(random(8, 16));
      for (let k = 0; k <= points; k++) {
        let a = map(k, 0, points, 0, TWO_PI);
        let r = segmentSize * 0.5;
        // Add subtle fracture deformation
        let deform = sin(time + a * 3 + v.phase) * 10;
        let x = cos(a + deform * 0.1) * (r + deform);
        let y = sin(a + deform * 0.1) * (r + deform);
        vertex(x, y);
      }
      endShape(CLOSE);
      
      // Draw connecting lines for fracture network
      stroke(v.hue, 80, 90, 0.6);
      strokeWeight(0.5);
      for (let k = 0; k < points; k++) {
        let a1 = map(k, 0, points, 0, TWO_PI);
        let a2 = map((k + 1) % points, 0, points, 0, TWO_PI);
        let r1 = segmentSize * 0.5;
        let r2 = segmentSize * 0.5;
        let x1 = cos(a1 + sin(time + a1 * 2) * 5 * 0.1) * (r1 + sin(time + a1 * 3) * 3);
        let y1 = sin(a1 + sin(time + a1 * 2) * 5 * 0.1) * (r1 + sin(time + a1 * 3) * 3);
        let x2 = cos(a2 + sin(time + a2 * 2) * 5 * 0.1) * (r2 + sin(time + a2 * 3) * 3);
        let y2 = sin(a2 + sin(time + a2 * 2) * 5 * 0.1) * (r2 + sin(time + a2 * 3) * 3);
        line(x1, y1, x2, y2);
      }
    }
    
    pop();
  }
  
  // Add subtle organic movement to the overall structure
  for (let i = 0; i < veins.length; i++) {
    let v = veins[i];
    v.x += sin(time * 0.5 + i) * 0.2;
    v.y += cos(time * 0.3 + i) * 0.2;
    // Keep veins within canvas bounds
    v.x = (v.x + width) % width;
    v.y = (v.y + height) % height;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
