let planes = [];
let connections = [];
let rotationSpeed = 0;
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create floating planes
  for (let i = 0; i < 20; i++) {
    planes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(50, 150),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      speedX: random(-0.01, 0.01),
      speedY: random(-0.01, 0.01),
      speedZ: random(-0.005, 0.005),
      hue: random(360)
    });
  }
  
  // Create connections between planes
  for (let i = 0; i < planes.length; i++) {
    for (let j = i + 1; j < planes.length; j++) {
      const d = dist(planes[i].x, planes[i].y, planes[i].z, planes[j].x, planes[j].y, planes[j].z);
      if (d < 300) {
        connections.push({
          a: i,
          b: j,
          alpha: random(0.1, 0.5)
        });
      }
    }
  }
}

function draw() {
  background(0);
  
  // Slowly vary rotation speed in a wave pattern
  rotationSpeed = map(sin(time * 0.002), -1, 1, 0.001, 0.005);
  rotateY(time * rotationSpeed);
  rotateX(sin(time * 0.001) * 0.1);
  
  // Draw glowing planes
  for (let i = 0; i < planes.length; i++) {
    push();
    
    const p = planes[i];
    
    translate(p.x, p.y, p.z);
    rotateX(p.rotX);
    rotateY(p.rotY);
    
    // Animate rotation
    p.rotX += p.speedX;
    p.rotY += p.speedY;
    p.z += p.speedZ;
    
    // Wrap around edges
    if (p.z > 300) p.z = -300;
    if (p.z < -300) p.z = 300;
    
    // Draw plane with glow effect
    noStroke();
    fill(p.hue, 100, 100, 0.7);
    plane(p.size);
    
    // Add a bright inner glow
    fill(p.hue, 100, 100, 0.3);
    plane(p.size * 0.6);
    
    pop();
  }
  
  // Draw connections with pulsing effect
  strokeWeight(1);
  for (let i = 0; i < connections.length; i++) {
    const c = connections[i];
    const a = planes[c.a];
    const b = planes[c.b];
    
    // Pulsing alpha based on time and distance
    const pulse = sin(time * 0.01 + i) * 0.3 + 0.7;
    const alpha = c.alpha * pulse;
    
    stroke(a.hue, 100, 100, alpha);
    line(a.x, a.y, a.z, b.x, b.y, b.z);
  }
  
  time++;
}
