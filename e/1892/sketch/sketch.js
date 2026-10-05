let planes = [];
let connections = [];
let nodes = [];
let time = 0;
let slowdownTimer = 0;

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
  slowdownTimer += 0.01;

  // Slowdown every 15 seconds (900 frames at 60fps)
  let slowdownFactor = 1.0;
  if (slowdownTimer > 15) {
    // Synchronized deceleration over 2 seconds
    let slowDuration = 2; // seconds
    let timeInSlow = slowdownTimer - 15;
    if (timeInSlow < slowDuration) {
      slowdownFactor = map(timeInSlow, 0, slowDuration, 1.0, 0.2);
    } else {
      // Reset timer after slowdown
      slowdownTimer = 0;
    }
  }

  // Update and draw planes with synchronized orbit
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    
    // Update orbit position
    p.orbitAngle += p.orbitSpeed * slowdownFactor;
    p.x = cos(p.orbitAngle) * p.orbitRadius;
    p.y = sin(p.orbitAngle * 0.7) * p.orbitRadius; 
    p.z = sin(p.orbitAngle * 0.3) * p.orbitRadius;

    // Update rotation to synchronize with orbit
    p.rotX += p.speedX * slowdownFactor;
    p.rotY += p.speedY * slowdownFactor;

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
    c.pulse += c.speed * slowdownFactor;
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
    
    // Intensity pulse when planes are very close
    let intensityPulse = 0;
    if (dist < 150) {
      intensityPulse = map(dist, 0, 150, 1, 0);
    }

    stroke(200, 100, 100, alpha + pulseValue * 0.3 + intensityPulse * 0.7);
    strokeWeight(1 + pulseValue * 2 + intensityPulse * 3);

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
    n.burst += n.burstSpeed * slowdownFactor;
    if (n.burst > TWO_PI) n.burst = 0;

    let burstValue = sin(n.burst);
    
    // Add periodic flicker to node intensity
    let flicker = sin(time * 2 + i) * 0.3 + 0.7; // Flickering between 0.4 and 1
    
    fill(n.hue, 100, 100, (0.8 + burstValue * 0.2) * flicker);
    vertex(n.x, n.y, n.z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
