let planes = [];
let connections = [];
let nodes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize planes with synchronized rotation
  for (let i = 0; i < 8; i++) {
    planes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(100, 300),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      speedX: random(-0.005, 0.005),
      speedY: random(-0.005, 0.005),
      hue: random(360),
      orbitRadius: random(100, 200),
      orbitSpeed: random(0.001, 0.003),
      orbitAngle: random(TWO_PI)
    });
  }

  // Initialize connections (lines between planes)
  for (let i = 0; i < planes.length; i++) {
    for (let j = i + 1; j < planes.length; j++) {
      connections.push({
        planeA: i,
        planeB: j,
        pulse: 0,
        speed: random(0.01, 0.03)
      });
    }
  }

  // Initialize nodes
  for (let i = 0; i < 50; i++) {
    nodes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(3, 8),
      hue: random(360),
      burst: 0,
      burstSpeed: random(0.05, 0.1)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  noStroke();

  time += 0.01;

  // Update and draw planes with synchronized orbit
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    
    // Update orbit position
    p.orbitAngle += p.orbitSpeed;
    p.x = cos(p.orbitAngle) * p.orbitRadius;
    p.y = sin(p.orbitAngle * 0.7) * p.orbitRadius; // Slight offset for orbital path
    p.z = sin(p.orbitAngle * 0.3) * p.orbitRadius;

    // Update rotation to synchronize with orbit
    p.rotX += p.speedX;
    p.rotY += p.speedY;

    push();
    translate(p.x, p.y, p.z);
    rotateX(p.rotX);
    rotateY(p.rotY);

    // Draw glowing plane
    fill(p.hue, 80, 90, 0.3);
    plane(p.size, p.size);

    // Draw wireframe
    stroke(p.hue, 100, 100, 0.5);
    noFill();
    plane(p.size, p.size);
    pop();
  }

  // Update and draw connections between planes
  beginShape(LINES);
  for (let i = 0; i < connections.length; i++) {
    let c = connections[i];
    let a = planes[c.planeA];
    let b = planes[c.planeB];

    // Update pulse
    c.pulse += c.speed;
    if (c.pulse > TWO_PI) c.pulse = 0;

    // Calculate distance between planes
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    let dz = a.z - b.z;
    let dist = sqrt(dx*dx + dy*dy + dz*dz);

    // Pulsing effect when close
    let pulseValue = sin(c.pulse);
    
    // Set color based on proximity
    let alpha = map(dist, 0, 500, 0.8, 0.1);
    if (dist < 200) {
      alpha = map(dist, 0, 200, 0.8, 0);
    }
    
    stroke(200, 100, 100, alpha + pulseValue * 0.3);
    strokeWeight(1 + pulseValue * 2);

    // Draw connection
    vertex(a.x, a.y, a.z);
    vertex(b.x, b.y, b.z);
  }
  endShape();

  // Update and draw nodes as a point cloud
  beginShape(POINTS);
  for (let i = 0; i < nodes.length; i++) {
    let n = nodes[i];
    
    // Update burst effect
    n.burst += n.burstSpeed;
    if (n.burst > TWO_PI) n.burst = 0;

    let burstValue = sin(n.burst);
    
    fill(n.hue, 100, 100, 0.8 + burstValue * 0.2);
    vertex(n.x, n.y, n.z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
