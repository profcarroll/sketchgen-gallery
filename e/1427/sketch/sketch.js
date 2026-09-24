let planes = [];
let lines = [];
let nodes = [];
let time = 0;
let typography1, typography2;
let cam;

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

  // Initialize lines
  for (let i = 0; i < 20; i++) {
    lines.push({
      x1: random(-width/2, width/2),
      y1: random(-height/2, height/2),
      z1: random(-200, 200),
      x2: random(-width/2, width/2),
      y2: random(-height/2, height/2),
      z2: random(-200, 200),
      pulse: 0,
      speed: random(0.01, 0.03)
    });
  }

  // Initialize nodes
  for (let i = 0; i < 50; i++) {
    nodes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(3, 8),
      hue: random(360)
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

  // Update and draw lines
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    
    // Update pulse
    l.pulse += l.speed;
    if (l.pulse > TWO_PI) l.pulse = 0;

    let pulseValue = sin(l.pulse);
    
    push();
    translate(0, 0, 0);
    stroke(200, 100, 100, 0.7 + pulseValue * 0.3);
    strokeWeight(2 + pulseValue * 2);
    line(l.x1, l.y1, l.z1, l.x2, l.y2, l.z2);
    pop();
  }

  // Draw nodes at intersections
  for (let i = 0; i < nodes.length; i++) {
    let n = nodes[i];
    
    push();
    translate(n.x, n.y, n.z);
    fill(n.hue, 100, 100, 0.8);
    ellipse(0, 0, n.size);
    pop();
  }

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
