let lines = [];
let nodes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);
  
  // Create initial lines and nodes
  for (let i = 0; i < 200; i++) {
    const x = random(-width/2, width/2);
    const y = random(-height/2, height/2);
    const z = random(-100, 100);
    lines.push({x, y, z, vx: random(-0.5, 0.5), vy: random(-0.5, 0.5), vz: random(-0.5, 0.5)});
    
    nodes.push({
      x: x + random(-20, 20),
      y: y + random(-20, 20),
      z: z + random(-20, 20),
      size: random(2, 8)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement
  const cx = sin(time * 0.1) * width/4;
  const cy = cos(time * 0.1) * height/4;
  const cz = sin(time * 0.05) * 300;
  camera(0, 0, cz, cx, cy, 0, 0, 1, 0);
  
  // Draw connecting lines
  stroke(0.8, 0.8, 1, 0.2);
  noFill();
  beginShape(LINES);
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const next = lines[(i + 1) % lines.length];
    
    vertex(l.x, l.y, l.z);
    vertex(next.x, next.y, next.z);
  }
  endShape();
  
  // Draw nodes
  noStroke();
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const hue = (time + i * 0.1) % 1;
    fill(hue, 0.8, 1, 0.8);
    
    push();
    translate(n.x, n.y, n.z);
    sphere(n.size);
    pop();
  }
  
  // Update positions
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    l.x += l.vx;
    l.y += l.vy;
    l.z += l.vz;
    
    if (abs(l.x) > width/2 + 100 || abs(l.y) > height/2 + 100) {
      l.vx *= -1;
      l.vy *= -1;
    }
    
    // Add some randomness
    l.vx += random(-0.05, 0.05);
    l.vy += random(-0.05, 0.05);
    l.vz += random(-0.05, 0.05);
    
    // Clamp velocities
    l.vx = constrain(l.vx, -1, 1);
    l.vy = constrain(l.vy, -1, 1);
    l.vz = constrain(l.vz, -1, 1);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
