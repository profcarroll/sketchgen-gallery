let planes = [];
let nodes = [];
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();

  // Create geometric planes
  for (let i = 0; i < 12; i++) {
    planes.push({
      x: random(-400, 400),
      y: random(-300, 300),
      z: random(-500, 500),
      size: random(100, 300),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      color: color(0, 100, 50, 150)
    });
  }

  // Create luminous nodes
  for (let i = 0; i < 20; i++) {
    nodes.push({
      x: random(-400, 400),
      y: random(-300, 300),
      z: random(-500, 500),
      size: random(10, 30),
      pulse: random(1)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Ambient pulsing light
  const pulse = sin(time * 2) * 0.5 + 0.5;
  
  // Camera movement for immersive effect
  rotateX(sin(time * 0.3) * 0.2);
  rotateY(time * 0.1);
  translate(0, 0, -800);

  // Draw planes
  for (let i = 0; i < planes.length; i++) {
    push();
    const p = planes[i];
    
    translate(p.x, p.y, p.z);
    rotateX(p.rotX + time * 0.1);
    rotateY(p.rotY + time * 0.2);
    rotateZ(p.rotZ + time * 0.15);

    // Emulate arterial seams with glowing lines
    fill(p.color);
    box(p.size, p.size, 20);
    
    // Pulsing seams
    const seamColor = lerpColor(color(0, 200, 100), color(0, 255, 150), pulse);
    stroke(seamColor);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let j = 0; j <= 20; j++) {
      const angle = map(j, 0, 20, 0, TWO_PI);
      const x = cos(angle) * p.size / 2;
      const y = sin(angle) * p.size / 2;
      vertex(x, y, -10);
    }
    endShape(CLOSE);
    
    pop();
  }

  // Draw nodes
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    push();
    translate(n.x, n.y, n.z);
    
    const pulseSize = n.size * (1 + sin(time * 5 + n.pulse) * 0.5);
    const nodeColor = color(0, 255, 200, 200);
    
    fill(nodeColor);
    noStroke();
    sphere(pulseSize);
    
    pop();
  }

  // Crystalline tessellation effect
  for (let i = 0; i < 100; i++) {
    const x = random(-400, 400);
    const y = random(-300, 300);
    const z = random(-500, 500);
    
    push();
    translate(x, y, z);
    rotateX(time * 0.1 + i);
    rotateY(time * 0.2 + i);
    
    const size = map(sin(time * 3 + i), -1, 1, 2, 8);
    fill(0, 200, 150, 100);
    noStroke();
    sphere(size);
    pop();
  }
}
