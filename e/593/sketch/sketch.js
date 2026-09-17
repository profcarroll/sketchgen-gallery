let particles = [];
let connections = [];
const particleCount = 200;
const connectionDistance = 150;
const hueRange = 60; // cyan to violet range
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 100);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      vz: random(-0.5, 0.5),
      hue: random(hueRange)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Update and display particles
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;

    // Bounce off edges
    if (p.x < -width/2 || p.x > width/2) p.vx *= -1;
    if (p.y < -height/2 || p.y > height/2) p.vy *= -1;
    if (p.z < -100 || p.z > 100) p.vz *= -1;

    // Color modulation
    p.hue += sin(time + i * 0.02) * 0.5;
    
    // Vertex
    fill(p.hue, 80, 90);
    noStroke();
    vertex(p.x, p.y, p.z);
  }
  endShape();

  // Connections (capped per frame)
  connections = [];
  const maxConnections = 100;
  let count = 0;

  for (let i = 0; i < particles.length && count < maxConnections; i++) {
    for (let j = i + 1; j < particles.length && count < maxConnections; j++) {
      let p1 = particles[i];
      let p2 = particles[j];

      let dx = p1.x - p2.x;
      let dy = p1.y - p2.y;
      let dz = p1.z - p2.z;
      let distSq = dx * dx + dy * dy + dz * dz;

      if (distSq < connectionDistance * connectionDistance) {
        connections.push({p1, p2});
        count++;
      }
    }
  }

  // Draw connections
  strokeWeight(0.5);
  for (let c of connections) {
    let hue = (c.p1.hue + c.p2.hue) / 2;
    stroke(hue, 70, 80, 60);
    line(c.p1.x, c.p1.y, c.p1.z, c.p2.x, c.p2.y, c.p2.z);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
