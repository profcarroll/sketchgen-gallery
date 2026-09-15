let planes = [];
let nodes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);
  
  // Create intersecting planes
  for (let i = 0; i < 20; i++) {
    planes.push({
      x: random(-1, 1),
      y: random(-1, 1),
      z: random(-1, 1),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      speed: random(0.001, 0.003)
    });
  }
  
  // Create nodes at intersections
  for (let i = 0; i < 500; i++) {
    nodes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-width/2, width/2),
      size: random(2, 8),
      hue: random(1)
    });
  }
  
  frameRate(30);
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement
  let camX = sin(time * 0.2) * 500;
  let camY = cos(time * 0.15) * 300;
  let camZ = sin(time * 0.1) * 400;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  
  // Ambient lighting
  ambientLight(20);
  pointLight(255, 255, 255, 0, 0, 0);
  
  // Draw planes
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    
    push();
    rotateX(p.rotX + time * p.speed);
    rotateY(p.rotY + time * p.speed * 1.2);
    rotateZ(p.rotZ + time * p.speed * 0.8);
    
    // Plane grid
    stroke(255, 0.3);
    noFill();
    for (let j = 0; j < 20; j++) {
      let t = map(j, 0, 19, -200, 200);
      plane(400, 20);
      translate(0, 0, 20);
    }
    pop();
  }
  
  // Draw nodes at intersections
  noStroke();
  for (let i = 0; i < nodes.length; i++) {
    let n = nodes[i];
    
    push();
    translate(n.x, n.y, n.z);
    
    // Glow effect
    fill(n.hue, 1, 1, 0.8);
    sphere(n.size * 2);
    
    fill(n.hue, 1, 1, 0.4);
    sphere(n.size);
    
    pop();
  }
  
  // Draw connecting lines between nearby nodes
  stroke(1, 1, 1, 0.1);
  noFill();
  beginShape(LINES);
  for (let i = 0; i < nodes.length; i++) {
    let n1 = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      let n2 = nodes[j];
      
      let d = dist(n1.x, n1.y, n1.z, n2.x, n2.y, n2.z);
      if (d < 150) {
        vertex(n1.x, n1.y, n1.z);
        vertex(n2.x, n2.y, n2.z);
      }
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
