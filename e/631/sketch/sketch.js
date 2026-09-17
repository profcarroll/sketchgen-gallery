let particles = [];
let conduits = [];
let tunnelRadius = 200;
let tunnelLength = 1000;
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create particles
  for (let i = 0; i < 1000; i++) {
    particles.push({
      x: random(-tunnelRadius, tunnelRadius),
      y: random(-tunnelRadius, tunnelRadius),
      z: random(-tunnelLength/2, tunnelLength/2),
      size: random(1, 3),
      hue: random(180, 240),
      speed: random(0.5, 2)
    });
  }

  // Create energy conduits
  for (let i = 0; i < 20; i++) {
    conduits.push({
      angle: random(TWO_PI),
      radius: random(50, 150),
      z: random(-tunnelLength/2, tunnelLength/2),
      pulse: random(1)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement
  let camX = sin(time * 0.3) * 50;
  let camY = cos(time * 0.2) * 50;
  let camZ = -tunnelLength/2 + time * 8;
  
  camera(0, 0, camZ, 0, 0, 0, 0, 1, 0);
  
  // Draw tunnel walls
  drawTunnelWalls();
  
  // Draw energy conduits
  drawConduits();
  
  // Draw particles
  drawParticles();
}

function drawTunnelWalls() {
  stroke(200, 50, 80, 0.1);
  noFill();
  for (let i = 0; i < 30; i++) {
    let z = -tunnelLength/2 + i * (tunnelLength/30);
    let radius = tunnelRadius + sin(time + i * 0.2) * 50;
    
    push();
    translate(0, 0, z);
    sphere(radius, 16, 8);
    pop();
  }
}

function drawConduits() {
  noFill();
  
  for (let conduit of conduits) {
    let pulse = sin(time * 3 + conduit.pulse) * 0.5 + 0.5;
    let alpha = 0.3 + pulse * 0.2;
    
    stroke(180, 70, 90, alpha);
    strokeWeight(1 + pulse * 2);
    
    beginShape();
    for (let i = 0; i < 20; i++) {
      let angle = conduit.angle + i * 0.3;
      let radius = conduit.radius + sin(time + i) * 20;
      let z = conduit.z + i * 10;
      
      vertex(
        cos(angle) * radius,
        sin(angle) * radius,
        z
      );
    }
    endShape();
  }
}

function drawParticles() {
  noStroke();
  
  for (let p of particles) {
    let hue = (p.hue + time * 10) % 360;
    fill(hue, 80, 90, 0.8);
    
    let z = p.z + time * p.speed * 10;
    
    // Keep particles within tunnel bounds
    if (z > tunnelLength/2) {
      p.z = -tunnelLength/2;
    }
    
    push();
    translate(p.x, p.y, z);
    sphere(p.size, 4, 4);
    pop();
  }
}
