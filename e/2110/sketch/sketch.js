let planes = [];
let connections = [];
let nodes = [];
let time = 0;
let text1, text2;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize planes with synchronized rotation and fracture-like motion
  for (let i = 0; i < 12; i++) {
    planes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(80, 250),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      speedX: random(-0.003, 0.003),
      speedY: random(-0.003, 0.003),
      hue: random(360),
      orbitRadius: random(150, 300),
      orbitSpeed: random(0.001, 0.004),
      orbitAngle: random(TWO_PI),
      crackOffset: random(TWO_PI)
    });
  }

  // Initialize connections (lines between planes)
  for (let i = 0; i < planes.length; i++) {
    for (let j = i + 1; j < planes.length; j++) {
      connections.push({
        planeA: i,
        planeB: j,
        pulse: 0,
        speed: random(0.01, 0.025)
      });
    }
  }

  // Initialize nodes
  for (let i = 0; i < 80; i++) {
    nodes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(2, 6),
      hue: random(360),
      burst: 0,
      burstSpeed: random(0.03, 0.08)
    });
  }

  // Set up text
  text1 = "You're watching";
  text2 = "sketchgen TV";
}

function draw() {
  background(0, 0, 0, 0.1);
  noStroke();

  time += 0.01;

  // Update and draw planes with fracture-like motion
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    
    // Update orbit position
    p.orbitAngle += p.orbitSpeed;
    p.x = cos(p.orbitAngle) * p.orbitRadius;
    p.y = sin(p.orbitAngle * 0.7) * p.orbitRadius; 
    p.z = sin(p.orbitAngle * 0.3) * p.orbitRadius;

    // Update rotation to synchronize with orbit + crack effect
    p.rotX += p.speedX;
    p.rotY += p.speedY;
    
    // Add a subtle crack-like deformation
    let crackEffect = sin(time + p.crackOffset) * 0.2;
    p.size *= (1 + crackEffect);

    push();
    translate(p.x, p.y, p.z);
    rotateX(p.rotX);
    rotateY(p.rotY);

    // Draw glowing plane with fracture effect
    fill(p.hue, 80, 90, 0.25);
    plane(p.size, p.size);

    // Draw wireframe with subtle crack lines
    stroke(p.hue, 100, 100, 0.4);
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
    let alpha = map(dist, 0, 600, 0.8, 0.1);
    if (dist < 250) {
      alpha = map(dist, 0, 250, 0.8, 0);
    }
    
    // Intensity pulse when planes are very close
    let intensityPulse = 0;
    if (dist < 200) {
      intensityPulse = map(dist, 0, 200, 1, 0);
    }

    stroke(200, 100, 100, alpha + pulseValue * 0.3 + intensityPulse * 0.7);
    strokeWeight(1 + pulseValue * 1.5 + intensityPulse * 2);

    // Draw connection
    vertex(a.x, a.y, a.z);
    vertex(b.x, b.y, b.z);
  }
  endShape();

  // Update and draw nodes as a point cloud with flickering effect
  beginShape(POINTS);
  for (let i = 0; i < nodes.length; i++) {
    let n = nodes[i];
    
    // Update burst effect
    n.burst += n.burstSpeed;
    if (n.burst > TWO_PI) n.burst = 0;

    let burstValue = sin(n.burst);
    
    // Add periodic flicker to node intensity
    let flicker = sin(time * 2 + i) * 0.3 + 0.7; // Flickering between 0.4 and 1
    
    fill(n.hue, 100, 100, (0.8 + burstValue * 0.2) * flicker);
    vertex(n.x, n.y, n.z);
  }
  endShape();

  // Draw text
  push();
  translate(-width/3, -height/4, 0);
  textSize(32);
  fill(255);
  noStroke();
  text(text1, 0, 0);
  translate(0, 40, 0);
  text(text2, 0, 0);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
