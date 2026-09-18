let particles = [];
let connections = [];
let time = 0;
const particleCount = 200;
const connectionDistance = 150;
const gridSpacing = 30;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      vz: random(-0.5, 0.5),
      hue: random(180, 300)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;
    
    if (p.x < -width/2 || p.x > width/2) p.vx *= -1;
    if (p.y < -height/2 || p.y > height/2) p.vy *= -1;
    if (p.z < -300 || p.z > 300) p.vz *= -1;
    
    push();
    translate(p.x, p.y, p.z);
    noStroke();
    fill(p.hue, 80, 90, 0.8);
    sphere(5);
    pop();
  }
  
  // Draw connections
  beginShape(LINES);
  stroke(180, 70, 90, 0.3);
  strokeWeight(0.5);
  
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let p1 = particles[i];
      let p2 = particles[j];
      
      let dx = p1.x - p2.x;
      let dy = p1.y - p2.y;
      let dz = p1.z - p2.z;
      
      let distance = sqrt(dx*dx + dy*dy + dz*dz);
      
      if (distance < connectionDistance) {
        vertex(p1.x, p1.y, p1.z);
        vertex(p2.x, p2.y, p2.z);
      }
    }
  }
  endShape();
  
  // Add a subtle rotation
  rotateY(time * 0.1);
  rotateX(sin(time * 0.3) * 0.1);
}
