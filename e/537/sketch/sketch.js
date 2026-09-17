let particles = [];
let connections = [];
const particleCount = 200;
const connectionThreshold = 100;
const maxConnectionsPerFrame = 100;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      vz: random(-0.5, 0.5),
      hue: random(360)
    });
  }

  // Precompute connection indices for performance
  connections = [];
  for (let i = 0; i < particleCount; i++) {
    for (let j = i + 1; j < particleCount; j++) {
      connections.push({i, j});
    }
  }
}

function draw() {
  background(0);
  ambientLight(20);
  pointLight(255, 255, 255, 0, 0, 0);

  translate(0, 0, -500);
  rotateX(frameCount * 0.001);
  rotateY(frameCount * 0.002);

  // Update and draw particles
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;

    if (p.x < -width/2 || p.x > width/2) p.vx *= -1;
    if (p.y < -height/2 || p.y > height/2) p.vy *= -1;
    if (p.z < -500 || p.z > 500) p.vz *= -1;

    fill(p.hue, 80, 90);
    vertex(p.x, p.y, p.z);
  }
  endShape();

  // Draw connections
  beginShape(LINES);
  let drawn = 0;
  for (let i = 0; i < connections.length && drawn < maxConnectionsPerFrame; i++) {
    const {i: idx1, j: idx2} = connections[i];
    const p1 = particles[idx1];
    const p2 = particles[idx2];

    let dx = p1.x - p2.x;
    let dy = p1.y - p2.y;
    let dz = p1.z - p2.z;
    let distanceSq = dx*dx + dy*dy + dz*dz;

    if (distanceSq < connectionThreshold * connectionThreshold) {
      const brightness = map(sqrt(distanceSq), 0, connectionThreshold, 1, 0.2);
      
      fill(p1.hue, 80, 90 * brightness);
      vertex(p1.x, p1.y, p1.z);
      vertex(p2.x, p2.y, p2.z);
      drawn++;
    }
  }
  endShape();
}
