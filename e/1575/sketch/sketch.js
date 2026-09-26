let planes = [];
let connections = [];
let nodes = [];
let time = 0;
let typography1, typography2;
let pointCloud;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize planes
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
      hue: random(360)
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

  // Typography setup
  typography1 = createGraphics(300, 100);
  typography1.textAlign(CENTER, CENTER);
  typography1.textSize(24);
  typography1.fill(255);
  typography1.text("You're watching", 0, 0);

  typography2 = createGraphics(200, 100);
  typography2.textAlign(CENTER, CENTER);
  typography2.textSize(24);
  typography2.fill(255);
  typography2.text("sketchgen TV", 0, 0);

  // Build point cloud for nodes
  pointCloud = createGraphics(100, 100);
  pointCloud.noStroke();
  pointCloud.fill(255);
  for (let i = 0; i < 50; i++) {
    pointCloud.point(random(-50, 50), random(-50, 50));
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  noStroke();

  time += 0.01;

  // Update and draw planes
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    
    // Update position
    p.x += sin(time * 0.3 + i) * 0.5;
    p.y += cos(time * 0.2 + i) * 0.5;
    p.z += sin(time * 0.1 + i) * 0.5;
    
    // Update rotation
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

  // Draw typography
  push();
  translate(-width/2 + 150, -height/2 + 50);
  rotateY(0.01 * time);
  image(typography1, 0, 0);
  pop();

  push();
  translate(width/2 - 150, height/2 - 50);
  rotateY(-0.01 * time);
  image(typography2, 0, 0);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
