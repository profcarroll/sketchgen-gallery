let planes = [];
let connections = [];
let text1, text2;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create geometric planes
  for (let i = 0; i < 8; i++) {
    planes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(100, 300),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      speedX: random(-0.005, 0.005),
      speedY: random(-0.005, 0.005),
      speedZ: random(-0.005, 0.005),
      color: color(random(180, 360), 80, 90)
    });
  }

  // Create connection lines
  for (let i = 0; i < 200; i++) {
    connections.push({
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

  // Set up text
  text1 = "You're watching";
  text2 = "sketchgen TV";
}

function draw() {
  background(0);
  time += 0.005;

  // Camera movement for subtle rotation
  let camX = sin(time * 0.3) * 100;
  let camY = cos(time * 0.2) * 100;
  camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0);
  translate(camX, camY, 0);

  // Draw planes
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    push();
    translate(p.x, p.y, p.z);
    rotateX(p.rotX + time * p.speedX);
    rotateY(p.rotY + time * p.speedY);
    rotateZ(p.rotZ + time * p.speedZ);
    
    // Glow effect
    fill(p.color);
    noStroke();
    plane(p.size, p.size);

    // Wireframe for connection lines
    stroke(p.color);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let j = 0; j < 5; j++) {
      let angle = map(j, 0, 4, 0, TWO_PI);
      let x = cos(angle) * p.size/2;
      let y = sin(angle) * p.size/2;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    pop();
  }

  // Draw connections with pulsing effect
  beginShape(LINES);
  for (let i = 0; i < connections.length; i++) {
    let c = connections[i];
    
    // Update pulse
    c.pulse = sin(time * c.speed) * 0.5 + 0.5;
    
    // Check proximity for pulsing
    let dx = c.x1 - c.x2;
    let dy = c.y1 - c.y2;
    let dz = c.z1 - c.z2;
    let dist = sqrt(dx*dx + dy*dy + dz*dz);
    
    if (dist < 200) {
      c.pulse = map(dist, 0, 200, 1, 0.2);
    }
    
    // Set color with glow
    let alpha = map(c.pulse, 0, 1, 0.1, 0.8);
    stroke(200, 100, 100, alpha);
    strokeWeight(map(c.pulse, 0, 1, 0.5, 3));
    
    vertex(c.x1, c.y1, c.z1);
    vertex(c.x2, c.y2, c.z2);
  }
  endShape();

  // Draw text
  fill(200, 100, 100, 0.7);
  noStroke();
  textSize(36);
  textAlign(CENTER, CENTER);
  
  let tx1 = sin(time * 0.1) * 50;
  let ty1 = cos(time * 0.15) * 30;
  text(text1, width/2 + tx1, height/2 - 40 + ty1);

  let tx2 = cos(time * 0.12) * 60;
  let ty2 = sin(time * 0.18) * 25;
  text(text2, width/2 + tx2, height/2 + 40 + ty2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
